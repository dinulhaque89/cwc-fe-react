"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from "lucide-react";
import dynamic from 'next/dynamic';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/router';
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Assuming you have a Map component that supports SSR avoidance
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

// Schema for booking a ride
const schema = z.object({
  pickupLocation: z.string().nonempty({ message: "Pickup location is required" }),
  destinationLocation: z.string().nonempty({ message: "Destination location is required" }),
  preferredDate: z.date(),
  preferredTime: z.string().nonempty({ message: "Preferred time is required" }),
});



export default function Passenger() {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  const router = useRouter();
  const { toast } = useToast();

  // State for managing the review modal visibility
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null); // For storing the selected booking for review
  
  // Function to submit a new booking
  const onSubmit = async (data: any) => {
    const bookingDetails = {
      ...data,
      preferredDate: format(data.preferredDate, 'PPP'),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the booking');
      }

      await response.json();
      toast({
        title: 'Booking successful!',
        description: 'Your booking has been created successfully.',
        variant: 'default',
      });
      reset();
    } catch (error) {
      // ...
      toast({
        title: 'Failed to book the ride. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Function to cancel a booking
  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel the booking');
      }

      toast({
        title: 'Booking cancelled successfully',
        variant: 'default',
      });
    } catch (error) {
      // ...
      toast({
        title: 'Failed to cancel the booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Function to submit a review for a ride
  const submitReview = async (reviewData: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/bookings/${selectedBooking}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the review');
      }

      toast({
        title: 'Review submitted successfully',
        variant: 'default',
      });
      setIsReviewModalOpen(false);
    } catch (error) {
      // ...
      toast({
        title: 'Failed to submit the review. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form fields and submission button */}
      </form>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate and Review Ride</DialogTitle>
            <DialogDescription>
              Please provide your feedback for the ride.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const reviewData = {
              rating: formData.get("rating"),
              review: formData.get("review"),
            };
            submitReview(reviewData);
          }}
          className="mt-4 space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                placeholder="Enter a rating (1-5)"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="review">Review</Label>
              <Textarea
                id="review"
                name="review"
                placeholder="Write your review here"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Submit Review</Button>
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
