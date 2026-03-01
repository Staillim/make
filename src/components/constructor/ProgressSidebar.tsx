"use client";

import { Check, Circle } from "lucide-react";
import { clsx } from "clsx";
import { FASES_ORDEN, FASES_LABELS } from "@/types";
import type { ProgresoConstructor, FaseConstructor } from "@/types";

interface ProgressSidebarProps {
  progreso: ProgresoConstructor;
}

export function ProgressSidebar({ progreso }: ProgressSidebarProps) {
  const fasesVisibles = FASES_ORDEN.filter((f) => f !== "inicio");

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-800 p-6 hidden lg:block">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">
        Progreso
      </h3>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
          <span>Configuración</span>
          <span>{progreso.porcentaje}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progreso.porcentaje}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {fasesVisibles.map((fase, index) => {
          const isCompleted = progreso.fases_completadas.includes(fase);
          const isCurrent = progreso.fase_actual === fase;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div
              key={fase}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isCurrent && "bg-indigo-500/10 text-indigo-400",
                isCompleted && "text-green-400",
                isPending && "text-zinc-600"
              )}
            >
              {/* Icon */}
              {isCompleted ? (
                <Check size={16} className="text-green-500 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </div>
              ) : (
                <Circle size={16} className="text-zinc-700 shrink-0" />
              )}

              <span className="truncate">
                {FASES_LABELS[fase as FaseConstructor]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
