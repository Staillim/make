"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Set access token cookie for API calls
      if (session?.access_token) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; secure; samesite=strict; max-age=3600`;
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle cookie management for @supabase/ssr
      // No need to manually set cookies - @supabase/ssr handles this automatically
      
      // Sync user data to our custom usuarios table
      if (event === 'SIGNED_IN' && session?.user) {
        await syncUserToDatabase(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const syncUserToDatabase = async (user: User) => {
    try {
      // Ensure we have a valid user ID and email
      if (!user.id || !user.email) {
        console.error('Invalid user data for sync:', { id: user.id, email: user.email });
        return;
      }

      // Check if user exists in our usuarios table
      const { data: existingUser, error: selectError } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('id_usuario', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        console.error('Error checking existing user:', selectError);
        return;
      }

      if (!existingUser) {
        // Create user record in our custom table
        console.log('Creating new user record for:', user.email);
        
        const userData = {
          id_usuario: user.id,
          nombre: user.user_metadata?.full_name || 
                  user.user_metadata?.name || 
                  user.email?.split('@')[0] || 
                  'Usuario',
          email: user.email!,
          password_hash: user.app_metadata?.provider === 'google' ? 'oauth_google' : 'oauth_user',
          plan: 'free' as const,
        };

        const { error: insertError } = await supabase
          .from('usuarios')
          .insert(userData as any); // Type assertion for compatibility

        if (insertError) {
          console.error('Error creating user record:', insertError);
          console.error('User data attempted:', userData);
        } else {
          console.log('User record created successfully');
        }
      } else {
        console.log('User already exists in database');
      }
    } catch (error) {
      console.error('Error in syncUserToDatabase:', error);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }

      // If user is created and confirmed immediately, sync to database
      if (data.user && data.session) {
        await syncUserToDatabase(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected error in signUp:', error);
      return { 
        error: { 
          message: 'Error inesperado durante el registro',
          name: 'UnexpectedError',
          status: 500
        } as any 
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/dashboard`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Clear cookies manually as well
    if (typeof window !== 'undefined') {
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        loading: true,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}