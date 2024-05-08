'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);

    if (token) {
      // Fetch user data and update the state
      fetchUserData(token);
    }
  }, []);

  const { toast } = useToast();

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/');
  };

  const fetchUserData = async (token: string) => {
    try {
      // Make an API call to fetch user data based on the token
      const response = await fetch('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch user data.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching user data.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <img src="/logo.png" alt="Canary Wharf Chauffeur Logo" className="h-10" />
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;