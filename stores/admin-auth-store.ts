import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminRole = 'admin' | 'super_admin';

export interface AdminAuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  role: AdminRole;
  permissions: string[];
}

interface AdminAuthState {
  admin: AdminAuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (admin: AdminAuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setHydrated: (isHydrated: boolean) => void;
  updateAdmin: (admin: Partial<AdminAuthUser>) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  setSession: (accessToken: string, refreshToken?: string, admin?: AdminAuthUser) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (admin, accessToken, refreshToken) => {
        set({
          admin,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setHydrated: (isHydrated) => {
        set({ isHydrated });
      },

      updateAdmin: (adminPatch) => {
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...adminPatch } : null,
        }));
      },

      setTokens: (accessToken, refreshToken) => {
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
        }));
      },

      setSession: (accessToken, refreshToken, admin) => {
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
          admin: admin ?? state.admin,
          isAuthenticated: true,
        }));
      },
    }),
    {
      name: 'connecti-admin-auth',
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);