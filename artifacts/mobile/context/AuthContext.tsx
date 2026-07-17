import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AUTH_KEY = '@finbuddy_auth_v1';
const SESSION_KEY = '@finbuddy_session_v1';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        if (session) setUser(JSON.parse(session));
      } catch {}
      setIsLoaded(true);
    })();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      const existing = await AsyncStorage.getItem(AUTH_KEY);
      const accounts: Record<string, { name: string; password: string }> = existing
        ? JSON.parse(existing)
        : {};

      if (accounts[email.toLowerCase()]) {
        return { error: 'An account with this email already exists.' };
      }

      accounts[email.toLowerCase()] = { name, password };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(accounts));

      const u = { name, email: email.toLowerCase() };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
      return {};
    } catch {
      return { error: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const existing = await AsyncStorage.getItem(AUTH_KEY);
      const accounts: Record<string, { name: string; password: string }> = existing
        ? JSON.parse(existing)
        : {};

      const account = accounts[email.toLowerCase()];
      if (!account) return { error: 'No account found with this email.' };
      if (account.password !== password) return { error: 'Incorrect password.' };

      const u = { name: account.name, email: email.toLowerCase() };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
      return {};
    } catch {
      return { error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
