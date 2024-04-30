"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import Cookies from 'js-cookie';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        Cookies.set('token', responseData.access_token, { expires: 7, secure: true, sameSite: 'strict' });
        router.push('/passenger');
        toast({ title: 'Login Success', description: 'You are logged in.', variant: 'default' });
      } else {
        toast({ title: 'Login Failed', description: responseData.message || 'Please check your credentials and try again.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({ title: 'Error', description: (error as Error).message || 'An error occurred during login', variant: 'destructive' });
    }
  };

  return (
    <div className="login-container flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 bg-white shadow-md">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h1 className="text-center text-xl font-bold mb-6">Login to Your Account</h1>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email', { required: true })} />
              {errors.email && <p className="text-red-500">Email is required.</p>}
            </div>

            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register('password', { required: true })} />
              {errors.password && <p className="text-red-500">Password is required.</p>}
            </div>

            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}