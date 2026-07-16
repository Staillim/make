"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Perfil del usuario (mismo shape que daba Supabase antes para que el resto
// del código no necesite cambios).
export interface Profile {
  id_usuario: string;
  nombre: string;
  email: string;
  plan: "free" | "premium";
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { nombre?: string }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const r = await fetch("/api/auth/me", { credentials: "include" });
      if (r.ok) {
        const data = await r.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("loadMe error:", e);
      setUser(null);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMe().finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, metadata?: { nombre?: string }) => {
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          nombre: metadata?.nombre || email.split("@")[0],
        }),
      });
      const data = await r.json();
      if (!r.ok) return { error: data.error || "Error al registrarse" };
      setUser({
        id_usuario: data.id_usuario,
        nombre: data.nombre,
        email: data.email,
        plan: data.plan,
      });
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error desconocido" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) return { error: data.error || "Error al iniciar sesión" };
      setUser({
        id_usuario: data.id_usuario,
        nombre: data.nombre,
        email: data.email,
        plan: data.plan,
      });
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error desconocido" };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Error al cerrar sesión" };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: loadMe,
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
