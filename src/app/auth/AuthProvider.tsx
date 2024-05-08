'use client';

import React from 'react';
import { useAuth } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const AuthContext = React.createContext<ReturnType<typeof useAuth> | undefined>(undefined);