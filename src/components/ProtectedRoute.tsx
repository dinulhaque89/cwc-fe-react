// ProtectedRoute.tsx
'use client';

import { useAuth } from '@/app/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie'

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, fetchUserDetails } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get('token');
      const role = Cookies.get('role');
      if (token && role) {
        try {
          await fetchUserDetails(token, role);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user details:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
  
    fetchUser();
  }, [fetchUserDetails, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user || user.role !== requiredRole) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};