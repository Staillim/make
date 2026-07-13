"use client";

import { Button } from "@/components/ui";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "./BusinessCard";
import { useNegocios } from "@/lib/hooks";

export function BusinessList() {
  const { negocios, loading, error, eliminarNegocio, recargarNegocios } = useNegocios();

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este negocio? Esta acción no se puede deshacer.")) {
      const success = await eliminarNegocio(id);
      if (!success) {
        alert("Error al eliminar el negocio. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const handleRefresh = () => {
    recargarNegocios();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span>Cargando negocios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Error al cargar negocios
        </h3>
        <p className="text-zinc-500 mb-4 max-w-md">
          {error}
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Mis Negocios
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {negocios.length} negocio{negocios.length !== 1 ? "s" : ""} creado
            {negocios.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleRefresh}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Link href="/dashboard/negocio/nuevo">
            <Button>
              <Plus className="w-4 h-4" />
              Crear nuevo negocio
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {negocios.map((negocio) => (
          <BusinessCard
            key={negocio.id_negocio}
            negocio={negocio}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
