// UpdateStatus.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

interface UpdateStatusProps {
  bookingId: number;
  onUpdate: () => void;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ bookingId, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const { toast } = useToast();

  const handleUpdateStatus = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/driver/update-status/${bookingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: selectedStatus }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toast({
          title: 'Success',
          description: data.msg || 'Status updated successfully',
          variant: 'default',
        });

        onUpdate();
      } catch (error: any) {
        console.error('Error updating status:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update status',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Update Status</CardTitle> */}
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => setSelectedStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="on route to passenger pickup location">On route to passenger pickup location</SelectItem>
            <SelectItem value="picked up passenger">Picked up passenger</SelectItem>
            <SelectItem value="on route to passengers destination location">On route to passengers destination location</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button className="mt-4" onClick={handleUpdateStatus}>
          Update Status
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpdateStatus;