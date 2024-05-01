import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const BookRide = () => {
  const { toast } = useToast();
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleBookRide = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const bookingData = {
          start_location: pickupLocation,
          end_location: destinationLocation,
          start_time: new Date().toISOString(),
          booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newBooking = await response.json();
        console.log('Booking created:', newBooking);
        toast({ title: 'Ride Booked', description: 'Booking created successfully', variant: 'default' });
      } catch (error: any) {
        console.error('Error creating booking:', error);
        toast({ title: 'Error', description: error.message || 'Failed to create booking', variant: 'destructive' });
      }
    }
  };

  const handlePickupLocationChange = (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setPickupLocation(place.formatted_address);
    }
  };

  const handleDestinationLocationChange = (autocomplete: google.maps.places.Autocomplete) => {
    const place = autocomplete.getPlace();
    if (place.formatted_address) {
      setDestinationLocation(place.formatted_address);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Ride</CardTitle>
      </CardHeader>
      <CardContent>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''} libraries={['places']}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pickup">Pickup Location</Label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  const bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(49.911197, -8.623555),
                    new google.maps.LatLng(58.643997, 1.757763)
                  );
                  autocomplete.setBounds(bounds);
                  autocomplete.setOptions({ strictBounds: true });
                  autocomplete.addListener('place_changed', () => handlePickupLocationChange(autocomplete));
                }}
              >
                <Input id="pickup" placeholder="Enter pickup location" type="text" />
              </Autocomplete>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Autocomplete
                onLoad={(autocomplete) => {
                  const bounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(49.911197, -8.623555),
                    new google.maps.LatLng(58.643997, 1.757763)
                  );
                  autocomplete.setBounds(bounds);
                  autocomplete.setOptions({ strictBounds: true });
                  autocomplete.addListener('place_changed', () => handleDestinationLocationChange(autocomplete));
                }}
              >
                <Input id="destination" placeholder="Enter destination" type="text" />
              </Autocomplete>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label id="vehicle-label">Vehicle Type</Label>
              <Select aria-labelledby="vehicle-label">
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saloon">Saloon</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </LoadScript>
      </CardContent>
      <CardFooter>
        <Button onClick={handleBookRide}>Book Ride</Button>
      </CardFooter>
    </Card>
  );
};

export default BookRide;