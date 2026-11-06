'use client';

import React, { createContext, useContext } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => Promise<void>;
}

const ADMIN_USER: UserProfile = {
  id: 'admin-01',
  email: 'qasdwaqeema@gmail.com',
  full_name: 'Abid Mughal',
  role: 'admin',
  is_demo: false,
};

const AuthContext = createContext<AuthContextType>({
  user: ADMIN_USER,
  loading: false,
  isDemo: false,
  login: async () => ({ success: true }),
  demoLogin: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: ADMIN_USER,
        loading: false,
        isDemo: false,
        login: async () => ({ success: true }),
        demoLogin: () => {},
        logout: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
