'use client';

import React, { useState, useEffect } from 'react';
import ViewAssignedRides from './drivercomponents/ViewAssignedRides';
import ViewAvailableRides from './drivercomponents/ViewAvailableRides';
import UpdateStatus from './drivercomponents/UpdateStatus';
import ViewFeedback from './drivercomponents/ViewFeedback';
import Navbar from '@/components/Navbar';

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
    /* <ProtectedRoute requiredRole="driver"> */
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
      <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <section>
            
            <ViewAssignedRides onBookingSelect={handleBookingSelect} />
          </section>
          <section>
            <ViewAvailableRides />
          </section>
          {selectedBookingId && (
            <section>
              <UpdateStatus bookingId={selectedBookingId} onUpdate={handleStatusUpdate} />
            </section>
          )}
          <section>
            <ViewFeedback />
          </section>
        </div>
      </div>
      </div>
      // </ProtectedRoute>
  );
};

export default DriverPage;

