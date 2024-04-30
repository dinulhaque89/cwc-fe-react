import React, { useState, useEffect } from 'react';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Pagination } from '@/components/ui/pagination';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Booking {
    booking_id: number;
    booking_date: string;
    start_location: string;
    end_location: string;
    status: string;
    start_time: string;
    driver_id: number;
}
  
const ViewBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(5);
        

    // Helper functions for formatting
    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
      }
    
      function formatTime(timeString: string): string {
        const time = new Date(`1970-01-01T${timeString}Z`);
        return time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
  
      const { toast } = useToast(); 

  
      useEffect(() => {
        const fetchBookings = async () => {
          const token = Cookies.get('token');
          if (token) {
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/bookings`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await response.json();
              setBookings(data.bookings);
            } catch (error: any) {
              toast({ title: 'Error fetching bookings', description: error.message, variant: 'destructive' });
            }
          }
        };
    
        fetchBookings();
      }, [currentPage]);
    
    
      const indexOfLastBooking = currentPage * bookingsPerPage;
      const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
      const currentBookings: Booking[] = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    
      const totalPages = Math.ceil(bookings.length / bookingsPerPage);
    
      const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
  
  
    return (
          <Card>
            <CardHeader>
              <CardTitle>Your Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Driver ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBookings.map(booking => (
                    <TableRow key={booking.booking_id}>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link">{booking.booking_id}</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogTitle>Booking Details</DialogTitle>
                            <p>Date: {formatDate(booking.booking_date)}</p>
                            <p>Start Location: {booking.start_location}</p>
                            <p>End Location: {booking.end_location}</p>
                            <p>Status: {booking.status}</p>
                            {/* Add more details as needed */}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{formatDate(booking.booking_date)}</TableCell>
                      <TableCell>{formatTime(booking.start_time)}</TableCell>
                      <TableCell>{booking.driver_id}</TableCell>
                      
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        <Button size="icon" variant="outline">
                          <StarIcon className="w-4 h-4" />
                          <span className="sr-only">Rate this ride</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination>
               <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                  <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      aria-current={currentPage === i + 1 ? 'page' : undefined}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                  </Button>
                </div>
              </Pagination>             
            </CardContent>
          </Card>
    );
};
  
function StarIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
  
  export default ViewBookings;