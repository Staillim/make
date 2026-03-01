import { create } from "zustand";
import type { AuthSession } from "@/types";

interface AuthState {
  user: AuthSession | null;
  isAuthenticated: boolean;
  login: (user: AuthSession) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
