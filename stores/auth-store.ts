import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  
  // Actions
  loginMock: (user: User, accessToken: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
}));
