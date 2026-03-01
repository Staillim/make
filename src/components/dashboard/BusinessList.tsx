"use client";

import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
import { BusinessCard } from "./BusinessCard";
import { useNegocioStore } from "@/lib/store";

export function BusinessList() {
  const { negocios, eliminarNegocio } = useNegocioStore();

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este negocio?")) {
      eliminarNegocio(id);
    }
  };

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
        <Link href="/dashboard/negocio/nuevo">
          <Button>
            <Plus className="w-4 h-4" />
            Crear nuevo negocio
          </Button>
        </Link>
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
