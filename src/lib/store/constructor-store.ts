import { create } from "zustand";
import type { MensajeChat, FaseConstructor, ProgresoConstructor } from "@/types";
import { FASES_ORDEN } from "@/types";

interface ConstructorState {
  mensajes: MensajeChat[];
  progreso: ProgresoConstructor;
  cargando: boolean;
  agregarMensaje: (mensaje: MensajeChat) => void;
  avanzarFase: () => void;
  setFase: (fase: FaseConstructor) => void;
  setCargando: (cargando: boolean) => void;
  resetConstructor: () => void;
}

const progresoInicial: ProgresoConstructor = {
  fase_actual: "inicio",
  fases_completadas: [],
  porcentaje: 0,
};

export const useConstructorStore = create<ConstructorState>((set) => ({
  mensajes: [],
  progreso: progresoInicial,
  cargando: false,

  agregarMensaje: (mensaje) =>
    set((state) => ({ mensajes: [...state.mensajes, mensaje] })),

  avanzarFase: () =>
    set((state) => {
      const indexActual = FASES_ORDEN.indexOf(state.progreso.fase_actual);
      const siguienteFase = FASES_ORDEN[indexActual + 1] || "completado";
      const completadas = [...state.progreso.fases_completadas, state.progreso.fase_actual];
      const porcentaje = Math.round((completadas.length / FASES_ORDEN.length) * 100);

      return {
        progreso: {
          fase_actual: siguienteFase,
          fases_completadas: completadas,
          porcentaje,
        },
      };
    }),

  setFase: (fase) =>
    set((state) => ({
      progreso: { ...state.progreso, fase_actual: fase },
    })),

  setCargando: (cargando) => set({ cargando }),

  resetConstructor: () =>
    set({
      mensajes: [],
      progreso: progresoInicial,
      cargando: false,
    }),
}));
