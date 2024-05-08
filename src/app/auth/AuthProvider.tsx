'use client';

import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './useAuth';

interface AuthContextProps {
  user: {
    user_id: string;
    role: string;
    name: string;
    email: string;
  } | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, login, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};