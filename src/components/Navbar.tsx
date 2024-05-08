'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { LogOut } from 'lucide-react';
import { useAuthContext } from '@/app/auth/AuthProvider';
import Cookies from 'js-cookie';


interface User {
  user_id: string;
  role: string;
  name: string;
  email: string;
}






const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    toast({
      title: 'Logged Out',
      description: 'You have successfully logged out.',
      variant: 'default',
    });
    setUser(null);
    router.refresh();
    router.push('/');
  };

  const navigateToDashboard = () => {
    if (user && user.role) {
      router.push(`/${user.role}`);
      router.refresh();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <img src="/logo.png" alt="Company Logo" className="h-10" />
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
      <div className="flex items-center justify-end space-x-4">
        {user ? (
          <>
            <Button onClick={navigateToDashboard} className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              My Dashboard
            </Button>
            <Button onClick={handleLogout} className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button className="bg-transparent hover:bg-blue-700 text-white font-semibold py-2 px-4 border border-white hover:border-transparent rounded">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 border border-blue-700 hover:border-transparent rounded">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;