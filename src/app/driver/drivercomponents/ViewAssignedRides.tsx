// ViewAssignedRides.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

interface Booking {
  booking_id: number;
  passenger_id: number;
  start_location: string;
  end_location: string;
  booking_date: string;
  start_time: string;
  status: string;
}

interface ViewAssignedRidesProps {
    onBookingSelect: (bookingId: number) => void;
  }
  
  const ViewAssignedRides: React.FC<ViewAssignedRidesProps> = ({ onBookingSelect }) => {
    const [assignedRides, setAssignedRides] = useState<Booking[]>([]);
    const { toast } = useToast();
  
    useEffect(() => {
      const fetchAssignedRides = async () => {
        const token = Cookies.get('token');
        if (token) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/driver/assigned-rides`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const data = await response.json();
            setAssignedRides(data.assigned_rides);
          } catch (error: any) {
            console.error('Error fetching assigned rides:', error);
            toast({
              title: 'Error',
              description: error.message || 'Failed to fetch assigned rides',
              variant: 'destructive',
            });
          }
        }
      };
  
      fetchAssignedRides();
    }, [toast]);
  
    const canUpdateStatus = (status: string) => {
      return status !== 'completed' && status !== 'cancelled';
    };
  
    return (
      <Card>
        <CardHeader>
          {/* <CardTitle>Assigned Rides</CardTitle> */}
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
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedRides.map((ride) => (
                <TableRow key={ride.booking_id}>
                  <TableCell>{ride.booking_id}</TableCell>
                  <TableCell>{ride.passenger_id}</TableCell>
                  <TableCell>{ride.start_location}</TableCell>
                  <TableCell>{ride.end_location}</TableCell>
                  <TableCell>{ride.booking_date}</TableCell>
                  <TableCell>{ride.start_time}</TableCell>
                  <TableCell>{ride.status}</TableCell>
                  <TableCell>
                    {canUpdateStatus(ride.status) && (
                      <button onClick={() => onBookingSelect(ride.booking_id)}>Update Status</button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

export default ViewAssignedRides;