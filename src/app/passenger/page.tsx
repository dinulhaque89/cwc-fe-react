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

export default function PassengerPage() {
  const { user, loading, refreshUserDetails } = useAuth();

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

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{user ? `Welcome, ${user.name}!` : 'Passenger Dashboard'}</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateDetails onUpdate={refreshUserDetails} />
          <BookRide />
          <ViewBookings />
          <ViewReviews />
        </CardContent>
      </Card>
      <Button onClick={refreshUserDetails}>Refresh Data</Button>
    </div>
  );
}