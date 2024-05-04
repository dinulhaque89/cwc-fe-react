'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { GoogleMap, LoadScript, Autocomplete, DistanceMatrixService, DirectionsService } from '@react-google-maps/api';
import Cookies from 'js-cookie';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';

const googleMapsLibraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];


const BookRide = () => {
  const { toast } = useToast();
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isCalculatingFare, setIsCalculatingFare] = useState(false);
  const [mapsApiLoaded, setMapsApiLoaded] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleBookRide = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const bookingData = {
          start_location: pickupLocation,
          end_location: destinationLocation,
          start_time: selectedTime + ':00',
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
        toast({
          title: 'Ride Booked',
          description: 'Your ride has been successfully booked.',
          variant: 'default',
        });
      } catch (error: any) {
        console.error('Error creating booking:', error);
        toast({
          title: 'Booking Error',
          description: 'Failed to create the booking. Please try again.',
          variant: 'destructive',
        });
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

  const calculateFare = (distance: number, duration: number) => {
    const baseFare = 2.5;
    const perMileFare = 1.5;
    const perMinuteFare = 0.25;

    const fare = baseFare + perMileFare * distance + perMinuteFare * duration;
    setEstimatedFare(fare);
    setIsCalculatingFare(false);
  };

  const shouldShowEstimatedFare =
    pickupLocation &&
    destinationLocation &&
    selectedDate &&
    selectedTime &&
    selectedVehicleType;

  const isBookRideDisabled =
    !pickupLocation ||
    !destinationLocation ||
    !selectedDate ||
    !selectedTime ||
    !selectedVehicleType;



  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle>Book a Ride</CardTitle>
          <CardDescription>Enter your pickup and destination locations to book a ride.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
            libraries={googleMapsLibraries}
            onLoad={() => setMapsApiLoaded(true)}
          >
            {mapsApiLoaded && (
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input id="pickup" placeholder="Enter pickup location" type="text" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your pickup location within the United Kingdom.</p>
                      </TooltipContent>
                    </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input id="destination" placeholder="Enter destination" type="text" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your destination within the United Kingdom.</p>
                      </TooltipContent>
                    </Tooltip>
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
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label id="vehicle-label">Vehicle Type</Label>
                  <Select
                    value={selectedVehicleType}
                    onValueChange={setSelectedVehicleType}
                    aria-labelledby="vehicle-label"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saloon">Saloon</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {shouldShowEstimatedFare && !isCalculatingFare && (
                  <div className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Estimated Fare</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">£{estimatedFare?.toFixed(2) || 0.00}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {isCalculatingFare && (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-8 w-40" />
                  </div>
                )}
                <DistanceMatrixService
                  options={{
                    origins: [pickupLocation],
                    destinations: [destinationLocation],
                    travelMode: google.maps.TravelMode.DRIVING,
                  }}
                  callback={(response) => {
                    if (response && response.rows[0].elements[0].status === 'OK') {
                      const distanceInMeters = response.rows[0].elements[0].distance.value;
                      const durationInSeconds = response.rows[0].elements[0].duration.value;

                      const distanceInMiles = distanceInMeters / 1609.34;
                      const durationInMinutes = durationInSeconds / 60;

                      setIsCalculatingFare(true);
                      setTimeout(() => {
                        calculateFare(distanceInMiles, durationInMinutes);
                      }, 1000);
                    }
                  }}
                />
              </div>
            )}
          </LoadScript>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBookRide} disabled={isBookRideDisabled}>
            Book Ride
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default BookRide;