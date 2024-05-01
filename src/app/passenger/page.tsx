'use client';

import React from 'react';
import UpdateDetails from './passengercomponents/UpdateDetails';
import BookRide from './passengercomponents/BookRide';
import ViewBookings from './passengercomponents/ViewBookings';
import ViewReviews from './passengercomponents/ViewReviews';
import Navbar from '@/components/Navbar';


const Page = () => {
  return (
    <div key="1" className="flex min-h-screen flex-col items-center w-full gap-4 ml-auto md:gap-2 lg:gap-4">
      <div className="flex flex-col w-full gap-4 ml-auto md:gap-2 lg:gap-4">
        
        <section>
          <Navbar />
          <UpdateDetails />
        </section>
        <section>
          <BookRide />
        </section>
        <section>
          <ViewBookings />
        </section>
        <section>
          <ViewReviews />
        </section>
      </div>
    </div>
  );
};

export default Page;