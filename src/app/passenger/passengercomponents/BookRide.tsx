import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Map from '@/components/Map';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';



const BookRide = () => {
  const { toast } = useToast();

  const handleBookRide = async (bookingData: any) => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const newBooking = await response.json();
        console.log('Booking created:', newBooking);
        toast({ title: 'Ride Booked', description: 'Booking created successfully', variant: 'default' });
      } catch (error: any) {
        console.error('Error creating booking:', error);
        toast({ title: 'Error', description: error.message || 'Failed to create booking', variant: 'destructive' });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input id="pickup" placeholder="Enter pickup location" type="text" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" placeholder="Enter destination" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label id="vehicle-label">Vehicle Type</Label>
            <Select aria-labelledby="vehicle-label">
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBookRide}>Book Ride</Button>
      </CardFooter>
    </Card>
  );
};
  
  export default BookRide;