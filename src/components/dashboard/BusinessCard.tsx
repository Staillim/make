"use client";

import { Button } from "@/components/ui";
import { Store, ExternalLink, Pencil, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Negocio } from "@/types";

interface BusinessCardProps {
  negocio: Negocio;
  onDelete: (id: string) => void;
}

export function BusinessCard({ negocio, onDelete }: BusinessCardProps) {
  const estadoConfig = {
    activo: { label: "Activo", color: "bg-green-500", textColor: "text-green-500" },
    en_configuracion: { label: "En configuración", color: "bg-yellow-500", textColor: "text-yellow-500" },
    pausado: { label: "Pausado", color: "bg-zinc-500", textColor: "text-zinc-500" },
    eliminado: { label: "Eliminado", color: "bg-red-500", textColor: "text-red-500" },
  };

  const estado = estadoConfig[negocio.estado];

  return (
    <div className="group p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <Store className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {negocio.nombre || "Negocio sin nombre"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${estado.color}`} />
              <span className={`text-xs font-medium ${estado.textColor}`}>
                {estado.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* URL */}
      {negocio.url_tienda && (
        <p className="text-xs text-zinc-400 mb-4 truncate">
          🔗 {negocio.url_tienda}
        </p>
      )}

      {/* Date */}
      <p className="text-xs text-zinc-500 mb-4">
        Creado: {new Date(negocio.fecha_creacion).toLocaleDateString("es")}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {negocio.estado === "en_configuracion" ? (
          <Link href={`/dashboard/negocio/${negocio.id_negocio}/constructor`} className="flex-1">
            <Button size="sm" fullWidth>
              Continuar
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <>
            <Link href={`/dashboard/negocio/${negocio.id_negocio}/editar`} className="flex-1">
              <Button variant="outline" size="sm" fullWidth>
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
            </Link>
            <Link href={`/tienda/${negocio.id_negocio}`} target="_blank">
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-red-500"
          onClick={() => onDelete(negocio.id_negocio)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
