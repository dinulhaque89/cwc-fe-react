import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"
import Navbar from "@/components/Navbar"; // Import Navbar component instead of individual elements
import React from 'react';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"



export default function Home() {
    return (
      <div key="1" className="bg-white">
        <header className=" py-4">
          <Navbar /> {/* Use Navbar component here */}
        </header>
        <main>
          <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">Canary Wharf: Your Transportation Solution</h1>
              <p className="mb-6">
                Canary Wharf offers efficient and reliable transportation services for passengers while providing drivers
                with an easy-to-use platform to manage their jobs and earnings.
              </p>
              <Button>View All Services</Button>
            </div>
            <div>
              <Image
                alt="Busy city street with taxis"
                className="rounded-lg"
                height={400}
                src="/taxi.png"
                layout="responsive"
                width={600}
              />
            </div>
          </section>
          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex mb-12 items-center justify-start space-x-6">
              <div className="font-bold text-2xl mr-10">Featured in</div>
              <div className="flex space-x-12">
                {[1, 2, 3, 4].map((num) => (
                  <Image
                    key={num}
                    alt={`Featured logo ${num}`}
                    height={48} // Increased height for a bigger logo
                    src={`/logo${num}.png`}
                    layout="fixed"
                    width={180} // Increased width for a bigger logo
                  />
                ))}
              </div>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-yellow-500">★★★★☆</div>
                <div className="text-sm text-gray-500">2,394 Ratings</div>
                <div className="text-xs text-gray-400">Google Reviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold">A+</div>
                <div className="text-yellow-500">★★★★★</div>
                <div className="text-sm text-gray-500">125 Reviews</div>
                <div className="text-xs text-gray-400">BBB Rating</div>
              </div>
              <div className="col-span-1 lg:col-span-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">What Our Customers Say</h3>
                  <div className="text-gray-600">JOHN CARTER</div>
                  <p className="text-sm text-gray-500">
                    Canary Wharf made my trip stress-free and comfortable. Booking was easy, and my driver was courteous
                    and professional. Highly recommended!
                  </p>
                </div>
                <Button>View All Testimonials</Button>
              </div>
            </div>
          </section>
          <section className="bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-16">
              <h2 className="text-3xl font-bold mb-8">Our services</h2>
              <Button>View All Services</Button>
            </div>
          </section>
        </main>
        <footer className="border-t py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center text-sm text-gray-500">Features & Benefits</div>
          </div>
        </footer>
      </div>
    )
}
