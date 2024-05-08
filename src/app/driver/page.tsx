'use client';

import React, { useState, useEffect } from 'react';
import ViewAssignedRides from './drivercomponents/ViewAssignedRides';
import ViewAvailableRides from './drivercomponents/ViewAvailableRides';
import UpdateStatus from './drivercomponents/UpdateStatus';
import ViewFeedback from './drivercomponents/ViewFeedback';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';


const DriverPage = () => {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  const handleBookingSelect = (bookingId: number) => {
    setSelectedBookingId(bookingId);
  };

  const handleStatusUpdate = () => {
    // Refresh the assigned rides after updating the status
    setSelectedBookingId(null);
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Driver Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ViewAssignedRides onBookingSelect={handleBookingSelect} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ViewAvailableRides />
            </CardContent>
          </Card>
          {selectedBookingId && (
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateStatus bookingId={selectedBookingId} onUpdate={handleStatusUpdate} />
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <ViewFeedback />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverPage;

