// AcceptRide.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

interface AcceptRideProps {
  bookingId: number;
  onAccept: () => void;
}

const AcceptRide: React.FC<AcceptRideProps> = ({ bookingId, onAccept }) => {
  const { toast } = useToast();

  const handleAcceptRide = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/driver/accept-ride/${bookingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toast({
          title: 'Success',
          description: data.msg || 'Ride accepted successfully',
          variant: 'default',
        });

        onAccept();
      } catch (error: any) {
        console.error('Error accepting ride:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to accept ride',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Button onClick={handleAcceptRide}>Accept Ride</Button>
  );
};

export default AcceptRide;