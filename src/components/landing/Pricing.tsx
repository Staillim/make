"use client";

import { Button } from "@/components/ui";
import { Check, X } from "lucide-react";
import Link from "next/link";

const planes = [
  {
    nombre: "Free",
    precio: "0",
    periodo: "para siempre",
    descripcion: "Perfecto para empezar tu primer negocio",
    destacado: false,
    features: [
      { texto: "1 negocio", incluido: true },
      { texto: "Plantillas básicas", incluido: true },
      { texto: "Agente Constructor", incluido: true },
      { texto: "Agente Vendedor (limitado)", incluido: true },
      { texto: "Alertas de stock", incluido: true },
      { texto: "Reporte diario", incluido: true },
      { texto: "Plantillas premium", incluido: false },
      { texto: "Recomendaciones IA", incluido: false },
      { texto: "Dominio personalizado", incluido: false },
      { texto: "Soporte prioritario", incluido: false },
    ],
  },
  {
    nombre: "Premium",
    precio: "29",
    periodo: "/mes",
    descripcion: "Para emprendedores que quieren crecer",
    destacado: true,
    features: [
      { texto: "Negocios ilimitados", incluido: true },
      { texto: "Todas las plantillas", incluido: true },
      { texto: "Agente Constructor completo", incluido: true },
      { texto: "Agente Vendedor completo", incluido: true },
      { texto: "Agente Administrador", incluido: true },
      { texto: "Automatizaciones avanzadas", incluido: true },
      { texto: "Recomendaciones IA", incluido: true },
      { texto: "Cross-selling automático", incluido: true },
      { texto: "Dominio personalizado", incluido: true },
      { texto: "Soporte prioritario", incluido: true },
    ],
  },
];

export function Pricing() {
  return (
    <section id="planes" className="py-24 bg-white dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Planes simples y transparentes
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Empieza gratis y escala cuando estés listo. Sin sorpresas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {planes.map((plan) => (
            <div
              key={plan.nombre}
              className={`relative rounded-2xl p-8 ${
                plan.destacado
                  ? "border-2 border-indigo-500 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-zinc-950 shadow-xl shadow-indigo-500/10"
                  : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {plan.nombre}
                </h3>
                <p className="text-zinc-500 text-sm">{plan.descripcion}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-zinc-900 dark:text-white">
                  ${plan.precio}
                </span>
                <span className="text-zinc-500 ml-1">{plan.periodo}</span>
              </div>

              <Link href="/registro">
                <Button
                  variant={plan.destacado ? "primary" : "outline"}
                  fullWidth
                  size="lg"
                >
                  {plan.destacado ? "Comenzar ahora" : "Empezar gratis"}
                </Button>
              </Link>

              <div className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <div
                    key={feature.texto}
                    className="flex items-center gap-3"
                  >
                    {feature.incluido ? (
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-zinc-300 dark:text-zinc-600 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.incluido
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    >
                      {feature.texto}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
