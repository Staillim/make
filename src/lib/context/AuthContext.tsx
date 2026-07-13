"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

// Perfil del usuario en NUESTRA tabla `usuarios` (no en auth.users de Supabase).
// Es lo que la UI debe mostrar (nombre, plan). El `User` de Supabase Auth no
// tiene estos campos y mezclarlos causaba bugs de tipo.
type Profile = Pick<
  Database["public"]["Tables"]["usuarios"]["Row"],
  "id_usuario" | "nombre" | "email" | "plan"
>;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { [key: string]: unknown }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sincroniza el usuario de Supabase Auth con nuestra tabla `usuarios`.
// Se llama en SIGNED_IN (incluye login normal y OAuth Google).
// Está definida fuera del componente para evitar closures con TDZ sobre
// `useEffect` (versión anterior la declaraba después del effect y el linter
// de Next lo marcaba como bug de inmutabilidad).
async function syncUserToDatabase(user: User) {
  if (!user.id || !user.email) {
    console.error("Invalid user data for sync:", { id: user.id, email: user.email });
    return;
  }

  const { data: existingUser, error: selectError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("id_usuario", user.id)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    console.error("Error checking existing user:", selectError);
    return;
  }

  if (existingUser) return;

  const isGoogle = user.app_metadata?.provider === "google";
  const userData: Database["public"]["Tables"]["usuarios"]["Insert"] = {
    id_usuario: user.id,
    nombre:
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email.split("@")[0] ??
      "Usuario",
    email: user.email,
    // Password placeholder: el login real siempre pasa por Supabase Auth.
    // Nunca se valida contra password_hash en el backend propio.
    password_hash: isGoogle ? "oauth_google" : "oauth_user",
    plan: "free",
  };

  const { error: insertError } = await supabase
    .from("usuarios")
    .insert(userData);

  if (insertError) {
    console.error("Error creating user record:", insertError, userData);
  } else {
    console.log("User record created successfully for:", user.email);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nombre, email, plan")
      .eq("id_usuario", userId)
      .single();

    if (error) {
      console.error("Error loading profile:", error);
      return null;
    }
    setProfile(data as Profile | null);
    return data;
  }

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        await loadProfile(session.user.id);
      }
      setLoading(false);

      if (session?.access_token) {
        // samesite=lax (antes era strict, lo que rompía el redirect post-OAuth
        // de Google porque la cookie no viajaba en navegación cross-site).
        document.cookie = `sb-access-token=${session.access_token}; path=/; secure; samesite=lax; max-age=3600`;
      }
    });

    // Cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === "SIGNED_IN" && session?.user) {
          await syncUserToDatabase(session.user);
          await loadProfile(session.user.id);
        } else if (event === "SIGNED_OUT") {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { [key: string]: unknown }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
      });

      if (error) return { error };

      if (data.user && data.session) {
        await syncUserToDatabase(data.user);
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected error in signUp:", error);
      return {
        error: {
          message: "Error inesperado durante el registro",
          name: "UnexpectedError",
          status: 500,
        } as AuthError,
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (typeof window !== "undefined") {
      document.cookie =
        "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    return { error };
  };

  // Como este provider está marcado `"use client"`, siempre corre en el cliente.
  // El `loading` inicial ya es `true`, así que cualquier consumidor que dependa
  // de `user` durante SSR verá `null + loading=true`, que es lo que queremos.
  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile: async () => {
      if (user?.id) await loadProfile(user.id);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}