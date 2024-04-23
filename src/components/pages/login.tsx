"use client";


import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState } from 'react';
import jwt from 'jsonwebtoken';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';




export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginError, setLoginError] = useState('');


  const onSubmit = async (data: any) => {
    
    try {
      const router = useRouter();

      console.log("Sending login request with data:", data);
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });


      console.log("Login response status:", response.status);
      console.log("Login response data:", await response.json());

      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem('token', access_token);

        const decoded: any = jwt.decode(access_token);
        const userRole = decoded.role;

        switch (userRole) {
          case 'passenger':
            router.push('/passenger/dashboard'); 
            break;
          case 'driver':
            router.push('/driver/dashboard'); 
            break;
          case 'admin':
            router.push('/admin/dashboard'); 
            break;
          default:
            console.error('Unknown role');
        }
      } else {
        setLoginError('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login request failed', error);
      setLoginError('An error occurred during login. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="email">
            Email
          </Label>
          <Input className="col-span-3" id="email" type="email" {...register('email', { required: true })} />
          {errors.email && <p>Email is required.</p>}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="password">
            Password
          </Label>
          <Input className="col-span-3" id="password" type="password" {...register('password', { required: true })} />
          {errors.password && <p>Password is required.</p>}
        </div>
      </div>
      <Button type="submit">Login</Button>
      {loginError && <p>{loginError}</p>}
    </form>
  );
}