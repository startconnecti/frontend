'use client';

import { ReactNode, createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthContextType {
  // We keep this lightweight as requested
  // The actual state is in the Zustand store
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setHydrated = useAuthStore((state) => state.setHydrated);

  useEffect(() => {
    // Mark hydration on mount
    setHydrated();
  }, [setHydrated]);

  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
