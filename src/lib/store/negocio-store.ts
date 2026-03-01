import { create } from "zustand";
import type { Negocio } from "@/types";

interface NegocioState {
  negocios: Negocio[];
  negocioActual: Negocio | null;
  setNegocios: (negocios: Negocio[]) => void;
  agregarNegocio: (negocio: Negocio) => void;
  setNegocioActual: (negocio: Negocio | null) => void;
  eliminarNegocio: (id: string) => void;
  actualizarNegocio: (id: string, data: Partial<Negocio>) => void;
}

export const useNegocioStore = create<NegocioState>((set) => ({
  negocios: [],
  negocioActual: null,
  setNegocios: (negocios) => set({ negocios }),
  agregarNegocio: (negocio) =>
    set((state) => ({ negocios: [...state.negocios, negocio] })),
  setNegocioActual: (negocio) => set({ negocioActual: negocio }),
  eliminarNegocio: (id) =>
    set((state) => ({
      negocios: state.negocios.filter((n) => n.id_negocio !== id),
    })),
  actualizarNegocio: (id, data) =>
    set((state) => ({
      negocios: state.negocios.map((n) =>
        n.id_negocio === id ? { ...n, ...data } : n
      ),
    })),
}));
