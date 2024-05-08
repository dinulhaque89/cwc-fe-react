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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Login error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const token = data.access_token;
      Cookies.set('token', token);

      // Fetch user details based on the selected role
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/${role}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await userResponse.json();
      let mappedUser: User;

      if (role === 'driver') {
        mappedUser = {
          user_id: userData.driver_id.toString(),
          role,
          name: userData.name || '',
          email: userData.email || '',
        };
      } else {
        mappedUser = {
          user_id: userData.user_id.toString(),
          role,
          name: userData.name || '',
          email: userData.email || '',
        };
      }
      Cookies.set('user', JSON.stringify(mappedUser));

      setUser(mappedUser);
      console.log('User logged in:', mappedUser);
      setLoading(false);
      router.push(`/${role}`);
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/');
  };

  return { user, loading, login, logout };
};