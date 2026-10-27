
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import type { LoginResponse } from "../services/auth";

type Usuario = LoginResponse["usuario"];

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;

  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,

      login: (token, usuario) =>
        set({
          token,
          usuario,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          usuario: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
