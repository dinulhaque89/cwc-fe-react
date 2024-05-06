// ViewFeedback.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

interface Feedback {
  review_id: number;
  comments: string;
  rating: number;

}

const ViewFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/driver/feedback`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setFeedback(data);
      } catch (error: any) {
        console.error('Error fetching feedback:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch feedback',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((review, index) => (
              <TableRow key={index}>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ViewFeedback;