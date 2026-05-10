import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '@/features/auth/types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  
  // Actions
  loginMock: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  setHydrated: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      loginMock: (user, accessToken) => 
        set({ 
          user, 
          accessToken, 
          isAuthenticated: true 
        }),

      logout: () => 
        set({ 
          user: null, 
          accessToken: null, 
          isAuthenticated: false 
        }),

      setHydrated: () => 
        set({ 
          isHydrated: true 
        }),

      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null
        })),
    }),
    {
      name: 'startconnecti-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
