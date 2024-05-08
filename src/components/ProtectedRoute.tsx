// ProtectedRoute.tsx
'use client';

import { useAuth } from '@/app/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== requiredRole) {
      router.push('/login');
    }
  }, [user, requiredRole, router]);

  if (!user || user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};