"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNegocios } from "@/lib/hooks";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function NuevoNegocioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { crearNegocio } = useNegocios();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    const crearNuevoNegocio = async () => {
      setLoading(true);
      setError(null);

      try {
        const nuevoNegocio = await crearNegocio('Nuevo Negocio');
        
        if (nuevoNegocio) {
          // Redirect to constructor
          router.replace(`/dashboard/negocio/${nuevoNegocio.id_negocio}/constructor`);
        } else {
          setError('No se pudo crear el negocio. Por favor, inténtalo de nuevo.');
        }
      } catch (err) {
        console.error('Error creating business:', err);
        setError('Error inesperado al crear el negocio.');
      } finally {
        setLoading(false);
      }
    };

    crearNuevoNegocio();
  }, [user, crearNegocio, router]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-500">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Error al crear negocio
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetry} variant="outline">
              Reintentar
            </Button>
            <Button onClick={handleGoBack}>
              Volver al dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Creando tu negocio...
        </h2>
        <p className="text-sm text-zinc-500">
          Preparando el agente constructor
        </p>
      </div>
    </div>
  );
}
