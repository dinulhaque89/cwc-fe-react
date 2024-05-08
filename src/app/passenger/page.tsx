// app/passenger/page.tsx
'use client';

import { useAuth } from '../auth/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import BookRide from './passengercomponents/BookRide';
import ViewBookings from './passengercomponents/ViewBookings';
import ViewReviews from './passengercomponents/ViewReviews';
import UpdateDetails from './passengercomponents/UpdateDetails';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Cookies from 'js-cookie';


export default function PassengerPage() {
  const { user, loading} = useAuth();
  const userCookie = Cookies.get('user');

  

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mt-2" />
          <Skeleton className="h-4 w-3/5 mt-2" />
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = () => {
    refreshUserDetails();
  };


  return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8">
          {loading ? (
            <Skeleton className="h-8 w-48 mb-8" />
          ) : (
            <h1 className="text-3xl font-bold mb-8">Passenger Dashboard</h1>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Update Details</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <UpdateDetails onUpdate={handleUpdate} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Book a Ride</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <BookRide />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-96" />
                ) : (
                  <ViewBookings />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <ViewReviews />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}