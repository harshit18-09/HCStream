import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isInitialized: false,
      setAuth: (payload) => {
        const { user, accessToken, refreshToken } = payload ?? {};
        set({
          user: user ?? null,
          accessToken: accessToken ?? null,
          refreshToken: refreshToken ?? null,
          isInitialized: true,
        });
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : updates ?? null,
        })),
      setInitialized: (flag) => set({ isInitialized: flag }),
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isInitialized: true,
        }),
    }),
    {
      name: "hcstream-auth",
      // Persist tokens temporarily to allow Authorization fallback when httponly cookies
      // are not available (e.g., testing with http S3 website). Be careful: this
      // stores tokens in storage accessible to JS. Remove this in production if
      // you rely on httponly cookies.
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, refreshToken: state.refreshToken }),
    }
  )
);
