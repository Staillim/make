"use client";

import { Button } from "@/components/ui";
import { Rocket, Plus, Sparkles, Store, Bot } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";

export function WelcomeEmpty() {
  const { user } = useAuth();

  const features = [
    {
      icon: Bot,
      title: "3 Agentes IA",
      description: "Constructor, vendedor y administrador automáticos"
    },
    {
      icon: Store,
      title: "Tienda online",
      description: "Diseño automático con productos y pagos"
    },
    {
      icon: Sparkles,
      title: "Sin código",
      description: "Solo conversación natural para crear todo"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {/* Illustration */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-12 h-12 text-indigo-500" />
        </div>

        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">
          ¡Bienvenido, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "emprendedor"}!
        </h2>
        <p className="text-zinc-500 mb-8 leading-relaxed text-lg">
          Crea tu primer negocio autónomo con inteligencia artificial.
          Nuestro agente constructor te guiará en cada paso.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <Link href="/dashboard/negocio/nuevo">
          <Button size="lg" className="text-lg px-8 py-3">
            <Plus className="w-5 h-5" />
            Crear mi primer negocio
          </Button>
        </Link>

        <p className="text-xs text-zinc-400 mt-4">
          ⚡ Proceso automatizado de 5 minutos
        </p>
      </div>
    </div>
  );
}
