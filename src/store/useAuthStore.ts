import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoggedIn: false,
      setToken: (token) => {
        set({
          token,
          isLoggedIn: !!token,
        });
      },
      login: (token) => set({ token, isLoggedIn: true }),
      logout: () => {
        set({
          token: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
