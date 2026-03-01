"use client";

import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function EditarNegocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Editar Negocio
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Identidad de Marca", desc: "Nombre, slogan, colores" },
          { title: "Plantilla", desc: "Cambiar o personalizar diseño" },
          { title: "Catálogo", desc: "Productos y categorías" },
          { title: "Agentes IA", desc: "Configurar vendedor y administrador" },
          { title: "Configuración Comercial", desc: "Pagos, envíos, devoluciones" },
          { title: "Automatizaciones", desc: "Alertas y reportes" },
        ].map((section) => (
          <div
            key={section.title}
            className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-indigo-500/30 transition-all cursor-pointer"
          >
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
              {section.title}
            </h3>
            <p className="text-sm text-zinc-500">{section.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
