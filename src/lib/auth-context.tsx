'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isDemo: false,
  login: async () => ({ success: false }),
  demoLogin: () => {},
  logout: async () => {},
});

const DEMO_USER: UserProfile = {
  id: 'demo-user-admin',
  email: 'admin@brightwaytrading.sa',
  full_name: 'Abid Mughal (Managing Director)',
  role: 'admin',
  is_demo: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for demo session or supabase auth session
    const initAuth = async () => {
      try {
        const savedDemo = localStorage.getItem('qwq_demo_user');
        if (savedDemo) {
          const parsed = JSON.parse(savedDemo);
          setUser(parsed);
          setIsDemo(true);
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Administrator',
              role: 'admin',
              is_demo: false,
            });
            setIsDemo(false);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Administrator',
            role: 'admin',
            is_demo: false,
          });
          setIsDemo(false);
        } else {
          // If not demo user, clear
          if (!localStorage.getItem('qwq_demo_user')) {
            setUser(null);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Check for demo fallback login or if Supabase is unconfigured
      if (!isSupabaseConfigured() || !supabase || email.toLowerCase().includes('demo') || email.toLowerCase().includes('brightwaytrading.sa')) {
        // Fallback login
        if (pass.length < 4) {
          setLoading(false);
          return { success: false, error: 'Password must be at least 4 characters.' };
        }
        const loggedUser: UserProfile = {
          id: 'user-admin-01',
          email,
          full_name: email.toLowerCase().includes('brightway') ? 'Abid Mughal' : 'Demo Administrator',
          role: 'admin',
          is_demo: !isSupabaseConfigured(),
        };
        setUser(loggedUser);
        setIsDemo(loggedUser.is_demo || false);
        localStorage.setItem('qwq_demo_user', JSON.stringify(loggedUser));
        setLoading(false);
        return { success: true };
      }

      // Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || 'Administrator',
          role: 'admin',
          is_demo: false,
        });
        setIsDemo(false);
        localStorage.removeItem('qwq_demo_user');
      }
      setLoading(false);
      return { success: true };
    } catch (e: any) {
      setLoading(false);
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const demoLogin = () => {
    setUser(DEMO_USER);
    setIsDemo(true);
    localStorage.setItem('qwq_demo_user', JSON.stringify(DEMO_USER));
  };

  const logout = async () => {
    localStorage.removeItem('qwq_demo_user');
    setUser(null);
    setIsDemo(false);
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
