// app/auth/useAuth.ts
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface User {
  user_id: string;
  role: string;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string, role: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Login error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const token = data.access_token;
      Cookies.set('token', token);

      const userDetails = await fetchUserDetails(token, role);
      setUser(userDetails);

      if (role === 'passenger') {
        router.push('/passenger');
      } else if (role === 'driver') {
        router.push('/driver');
      } else if (role === 'admin') {
        router.push('/admin');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  const fetchUserDetails = async (token: string, role: string) => {
    let endpoint = '';
    if (role === 'passenger') {
      endpoint = '/passenger/details';
    } else if (role === 'driver') {
      endpoint = '/driver/details';
    } else if (role === 'admin') {
      endpoint = '/admin/details';
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    const userDetails = await response.json();
    return userDetails;
  };

  const refreshUserDetails = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    if (token && user) {
      const userDetails = await fetchUserDetails(token, user.role);
      setUser(userDetails);
    }
    setLoading(false);
  };

  return { user, loading, login, logout, refreshUserDetails };
};