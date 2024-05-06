// ViewAvailableRides.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';
import AcceptRide from './AcceptRide';

interface Booking {
  booking_id: number;
  passenger_id: number;
  start_location: string;
  end_location: string;
  booking_date: string;
  start_time: string;
}

const ViewAvailableRides: React.FC = () => {
  const [availableRides, setAvailableRides] = useState<Booking[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  const fetchAvailableRides = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/driver/available-rides`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAvailableRides(data);
      } catch (error: any) {
        console.error('Error fetching available rides:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch available rides',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Rides</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Passenger ID</TableHead>
              <TableHead>Start Location</TableHead>
              <TableHead>End Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableRides.map((ride) => (
              <TableRow key={ride.booking_id}>
                <TableCell>{ride.booking_id}</TableCell>
                <TableCell>{ride.passenger_id}</TableCell>
                <TableCell>{ride.start_location}</TableCell>
                <TableCell>{ride.end_location}</TableCell>
                <TableCell>{ride.booking_date}</TableCell>
                <TableCell>{ride.start_time}</TableCell>
                <TableCell>
                  <AcceptRide
                    bookingId={ride.booking_id}
                    onAccept={() => fetchAvailableRides()}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewAvailableRides;