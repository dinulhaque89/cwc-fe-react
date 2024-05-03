'use client';


import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect } from 'react';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Cookies from 'js-cookie';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

interface Review {
  driver_name: string;
  rating: number;
  comments: string;
}

interface Booking {
  booking_id: number;
  booking_date: string;
  start_location: string;
  end_location: string;
  status: string;
  start_time: string;
  driver_id: number;
}

interface ManageReviewsProps {
  bookingId: number;
  driverId: number;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      className="w-6 h-6 text-yellow-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
);
  
const Rating: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
    return (
      <div className="flex">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => onChange(star)}
          >
            <StarIcon filled={star <= value} />
          </button>
        ))}
      </div>
    );
  };

const ManageReviews: React.FC<ManageReviewsProps> = ({ bookingId, driverId }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    const token = Cookies.get('token');
    if (!token) {
      toast({ title: 'Authentication Error', description: 'No token found', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          booking_id: bookingId,
          driver_id: driverId,
          rating,
          comments
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg);
      toast({ title: 'Review Submitted', description: 'Your review has been successfully submitted.', variant: 'default' });
      handleCloseDialog();
    } catch (error: any) {
      toast({ title: 'Error submitting review', description: error.message, variant: 'destructive' });
    }

    setIsSubmitting(false);
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setRating(0);
    setComments('');
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpenDialog}>
        <StarIcon filled={false} />
        <span className="sr-only">Rate this ride</span>
      </Button>

      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogTitle>Review Your Ride</DialogTitle>
          <DialogDescription>
            Please provide your feedback for this ride.
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating</Label>
              <Rating value={rating} onChange={setRating} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your comments"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitReview} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// function StarIcon(props: any) {
//     return (
//       <svg
//         {...props}
//         xmlns="http://www.w3.org/2000/svg"
//         width="24"
//         height="24"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//       </svg>
//     )
// }
  
export default ManageReviews;