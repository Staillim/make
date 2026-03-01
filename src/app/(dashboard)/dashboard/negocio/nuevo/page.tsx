"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNegocioStore, useAuthStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function NuevoNegocioPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const agregarNegocio = useNegocioStore((s) => s.agregarNegocio);

  useEffect(() => {
    const crearNegocio = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const id_negocio = crypto.randomUUID();
      const nuevoNegocio = {
        id_negocio,
        id_usuario: user?.id_usuario || "",
        nombre: null,
        estado: "en_configuracion" as const,
        fecha_creacion: new Date().toISOString(),
        url_tienda: null,
      };

      agregarNegocio(nuevoNegocio);
      router.replace(`/dashboard/negocio/${id_negocio}/constructor`);
    };

    crearNegocio();
  }, []);

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
