"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useNegocioStore } from "@/lib/store";
import { supabase } from "@/lib/supabase-auth";
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

export function useNegocios(): UseNegociosReturn {
  const { user, session } = useAuth();
  const { 
    negocios, 
    setNegocios, 
    agregarNegocio, 
    eliminarNegocio: eliminarNegocioStore,
    actualizarNegocio: actualizarNegocioStore 
  } = useNegocioStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to set session cookie for API calls (simplified since AuthContext handles it)
  const ensureAuth = () => {
    if (!user || !session?.access_token) {
      throw new Error('Usuario no autenticado');
    }
  };

  // Load businesses on mount and when user changes
  useEffect(() => {
    console.log('useNegocios effect - user:', user?.id, 'session:', session?.access_token?.slice(0, 20) + '...');
    if (user && session) {
      cargarNegocios();
    } else {
      setNegocios([]);
      setLoading(false);
    }
  }, [user, session, setNegocios]);

  // Set session cookie when session changes (handled by AuthContext)
  useEffect(() => {
    if (user) {
      cargarNegocios();
    } else {
      setNegocios([]);
      setLoading(false);
    }
  }, [user, session, setNegocios]);
  const cargarNegocios = async () => {
    try {
      console.log('cargarNegocios - starting, user:', user?.id);
      ensureAuth();
      setLoading(true);
      setError(null);

      console.log('cargarNegocios - making supabase query');
      const { data: negocios, error } = await supabase
        .from('negocios')
        .select(`
          id_negocio,
          id_usuario,
          nombre,
          estado,
          fecha_creacion,
          fecha_activacion,
          url_tienda,
          created_at,
          updated_at
        `)
        .eq('id_usuario', user!.id)
        .order('fecha_creacion', { ascending: false });

      console.log('cargarNegocios - query result:', { negocios, error });

      if (error) {
        throw new Error(error.message);
      }

      setNegocios(negocios || []);
      console.log('cargarNegocios - success, loaded', negocios?.length || 0, 'negocios');
    } catch (err) {
      console.error('Error loading businesses:', err);
      if (err instanceof Error && err.message === 'Usuario no autenticado') {
        setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
        // Clear user state and redirect to login
        window.location.href = '/login?redirect=dashboard';
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  const crearNegocio = async (nombre: string): Promise<Negocio | null> => {
    try {
      ensureAuth();
      setError(null);

      if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre del negocio es requerido');
      }

      const { data: negocio, error } = await supabase
        .from('negocios')
        .insert({
          id_usuario: user!.id,
          nombre: nombre.trim(),
          estado: 'en_configuracion'
        })
        .select(`
          id_negocio,
          id_usuario,
          nombre,
          estado,
          fecha_creacion,
          fecha_activacion,
          url_tienda,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Add to store
      agregarNegocio(negocio);
      
      return negocio;
    } catch (err) {
      console.error('Error creating business:', err);
      if (err instanceof Error && err.message === 'Usuario no autenticado') {
        setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
      } else {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
      return null;
    }
  };

  const eliminarNegocio = async (id: string): Promise<boolean> => {
    try {
      ensureAuth();
      setError(null);

      const { error } = await supabase
        .from('negocios')
        .delete()
        .eq('id_negocio', id)
        .eq('id_usuario', user!.id);

      if (error) {
        throw new Error(error.message);
      }

      // Remove from store
      eliminarNegocioStore(id);
      
      return true;
    } catch (err) {
      console.error('Error deleting business:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return false;
    }
  };

  const actualizarNegocio = async (id: string, data: Partial<Negocio>): Promise<boolean> => {
    try {
      ensureAuth();
      setError(null);

      // Filter allowed fields for update
      const allowedFields = ['nombre', 'estado', 'url_tienda'];
      const updateData: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateData[key] = value;
        }
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      const { data: negocio, error } = await supabase
        .from('negocios')
        .update(updateData)
        .eq('id_negocio', id)
        .eq('id_usuario', user!.id)
        .select(`
          id_negocio,
          id_usuario,
          nombre,
          estado,
          fecha_creacion,
          fecha_activacion,
          url_tienda,
          created_at,
          updated_at
        `)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!negocio) {
        throw new Error('Negocio no encontrado o sin permisos');
      }
      
      // Update in store
      actualizarNegocioStore(id, negocio);
      
      return true;
    } catch (err) {
      console.error('Error updating business:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
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