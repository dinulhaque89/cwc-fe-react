import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Cookies from 'js-cookie';

interface Review {
    driver_name: string;
    rating: number;
    comments: string;
  }
  
const ViewReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [viewAll, setViewAll] = useState(false);
  
    useEffect(() => {
        const fetchReviews = async () => {
            const token = Cookies.get('token');
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/passenger/reviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
  
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
  
                const data = await response.json();
                setReviews(data);
            } catch (error: any) {
                console.error('Error fetching reviews:', error);
            }
        };
  
        fetchReviews();
    }, []);
      


//TODO - Add carousel shadcn ui component for the reviews and keep the existing View all button

return (
        <Card>
            <CardHeader>
                {/* <CardTitle>Reviews</CardTitle> */}
            </CardHeader>
            <CardContent>
            {reviews.map((review, index) => (
          <div key={index} className="flex items-start gap-4">
            <Avatar>
              <AvatarImage alt={`Driver ${review.driver_name}`} src="/placeholder-user.jpg" />
              <AvatarFallback>{review.driver_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{review.driver_name}</div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary' : ''}`} />
                ))}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                {review.comments}
              </div>
            </div>
          </div>
        ))}
        <Button onClick={() => setViewAll(!viewAll)}>{viewAll ? 'Show Less' : 'View All'}</Button>
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


export default ViewReviews;