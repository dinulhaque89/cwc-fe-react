'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import ChangePassword from './ChangePassword';

interface UserData {
  name: string;
  email: string;
  mobile_phone: string;
  avatar_url: string;
}

const UpdateDetails = () => {
  const [userData, setUserData] = useState<UserData>({ name: '', email: '', mobile_phone: '', avatar_url: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/details`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setUserData(data);
          
          return data;
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          toast({ title: 'Error', description: error.message || 'Failed to fetch user data', variant: 'destructive' });
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateDetails = async () => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Updating details, should show toast next');
      toast({ title: 'Success', description: 'Details updated successfully', variant: 'default' });
    } catch (error: any) {
      console.error('Error updating details:', error);
      toast({ title: 'Error', description: error.message || 'Error updating details', variant: 'destructive' });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageUpdate = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('avatar', selectedImage);

      const token = Cookies.get('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/upload-avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUserData({ ...userData, avatar_url: data.avatar_url });
        setSelectedImage(null);
        toast({ title: 'Success', description: 'Avatar updated successfully', variant: 'default' });
      } catch (error: any) {
        console.error('Error updating avatar:', error);
        toast({ title: 'Error', description: error.message || 'Error updating avatar', variant: 'destructive' });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle >Update Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div>
          <Avatar className="w-48 h-48 border">
            <AvatarImage src={userData.avatar_url || "/placeholder-user.jpg"} alt="@username" />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex justify-end gap-4">
            <Input accept="image/*" id="image-upload" type="file" onChange={handleImageUpload} />
            <Button onClick={handleImageUpdate} className="mt-2">Update Avatar</Button>
          </div>
        </div>
        <div className="grid gap-4 mt-4 w-full max-w-lg">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mobile_phone">Mobile Phone</Label>
            <Input id="mobile_phone" value={userData.mobile_phone} onChange={(e) => setUserData({ ...userData, mobile_phone: e.target.value })} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button onClick={handleUpdateDetails}>Update Details</Button>
        <ChangePassword />
      </CardFooter>
    </Card>
  );
};

export default UpdateDetails;