'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BellIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('token'));
  }, []);

  const { toast } = useToast();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  useEffect(() => {
    if (!isLoggedIn && !Cookies.get('token')) {
      toast({
        title: 'Unauthorized',
        description: 'Please log in to access your account.',
        variant: 'destructive'
      });
    }
  }, [isLoggedIn, toast]);



  return (
    <header className="flex h-16 shrink-0 items-center px-4 md:px-6 justify-between">
      <nav className="flex flex-col gap-6 md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="/">
          <img src="/logo.png" alt="Canary Wharf Chauffeur Logo" className="w-6 h-6" />
          <span className="sr-only">Canary Wharf Chauffeur</span>
        </Link>
        <Link className="font-bold" href="#">
          Book a Ride
        </Link>
        <Link className="text-gray-500 dark:text-gray-400" href="#">
          View Bookings
        </Link>
        <Link className="text-gray-500 dark:text-gray-400" href="#">
          Reviews
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Button variant="ghost" onClick={() => router.push('/passenger')}>
              My Account
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </div>
    
   


    </header>
  );
};

export default Navbar;