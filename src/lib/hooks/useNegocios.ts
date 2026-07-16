"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useNegocioStore } from "@/lib/store";
import type { Negocio } from "@/types";

interface UseNegociosReturn {
  negocios: Negocio[];
  loading: boolean;
  error: string | null;
  crearNegocio: (nombre: string) => Promise<Negocio | null>;
  eliminarNegocio: (id: string) => Promise<boolean>;
  actualizarNegocio: (id: string, data: Partial<Negocio>) => Promise<boolean>;
  recargarNegocios: () => Promise<void>;
}

async function jsonOrError<T>(r: Response): Promise<{ data: T | null; error: string | null }> {
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    return { data: null, error: (body as { error?: string }).error || `HTTP ${r.status}` };
  }
  const body = await r.json();
  return { data: body as T, error: null };
}

export function useNegocios(): UseNegociosReturn {
  const { user } = useAuth();
  const {
    negocios,
    setNegocios,
    agregarNegocio,
    eliminarNegocio: eliminarNegocioStore,
    actualizarNegocio: actualizarNegocioStore,
  } = useNegocioStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarNegocios = async () => {
    try {
      setLoading(true);
      setError(null);
      const r = await fetch("/api/negocios", { credentials: "include" });
      const { data, error } = await jsonOrError<{ negocios: Negocio[] }>(r);
      if (error) {
        if (error.includes("No autorizado") || error.includes("401")) {
          setNegocios([]);
          return;
        }
        throw new Error(error);
      }
      setNegocios(data?.negocios ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      cargarNegocios();
    } else {
      setNegocios([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const crearNegocio = async (nombre: string): Promise<Negocio | null> => {
    try {
      setError(null);
      if (!nombre || nombre.trim() === "") {
        throw new Error("El nombre del negocio es requerido");
      }
      const r = await fetch("/api/negocios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nombre: nombre.trim() }),
      });
      const { data, error } = await jsonOrError<{ negocio: Negocio }>(r);
      if (error || !data) throw new Error(error || "No se pudo crear");
      agregarNegocio(data.negocio);
      return data.negocio;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return null;
    }
  };

  const eliminarNegocio = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const r = await fetch(`/api/negocios?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const { error } = await jsonOrError<{ success: boolean }>(r);
      if (error) throw new Error(error);
      eliminarNegocioStore(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    }
  };

  const actualizarNegocio = async (id: string, data: Partial<Negocio>): Promise<boolean> => {
    try {
      setError(null);
      const r = await fetch(`/api/negocios/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const { data: respData, error } = await jsonOrError<{ negocio: Negocio }>(r);
      if (error) throw new Error(error);
      if (respData?.negocio) actualizarNegocioStore(id, respData.negocio);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    }
  };

  const recargarNegocios = async () => {
    await cargarNegocios();
  };

  return {
    negocios,
    loading,
    error,
    crearNegocio,
    eliminarNegocio,
    actualizarNegocio,
    recargarNegocios,
  };
}
