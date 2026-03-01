"use client";

import { Button } from "@/components/ui";
import { Rocket, Plus } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

export function WelcomeEmpty() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-12 h-12 text-indigo-500" />
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
          ¡Bienvenido, {user?.nombre || "emprendedor"}!
        </h2>
        <p className="text-zinc-500 mb-8 leading-relaxed">
          Crea tu primer negocio autónomo con inteligencia artificial.
          Nuestro agente constructor te guiará en cada paso.
        </p>

        <Link href="/dashboard/negocio/nuevo">
          <Button size="lg">
            <Plus className="w-5 h-5" />
            Crear nuevo negocio
          </Button>
        </Link>
      </div>
    </div>
  );
}
