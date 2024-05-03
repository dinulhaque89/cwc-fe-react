import React from 'react';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';

interface CancelBookingProps {
    bookingId: number;
}

export function isMoreThanOneHourAway(bookingDate: string, startTime: string): boolean {
    const bookingDateTime = new Date(`${bookingDate}T${startTime}`);
    const currentTime = new Date();
    const oneHour = 60 * 60 * 1000; // milliseconds in one hour
    return (bookingDateTime.getTime() - currentTime.getTime()) > oneHour;
}
  

const CancelBooking: React.FC<CancelBookingProps> = ({ bookingId }) => {
    const { toast } = useToast();

    const handleCancelBooking = async () => {
        const token = Cookies.get('token');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required', variant: 'destructive' });
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to cancel booking');
            }

            toast({ title: 'Success', description: 'Booking cancelled successfully', variant: 'default' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <Button onClick={handleCancelBooking} variant="destructive">
            Cancel Booking
        </Button>
    );
};

export default CancelBooking;