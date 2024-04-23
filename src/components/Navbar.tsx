// components/Navbar.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Login from "@/components/pages/login";
import Image from 'next/image';




const Navbar = () => {
  return (
    <div key="1" className="bg-white">
      <header className="border-b py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              alt="Canary Wharf Taxi Logo"
              src="/logo.png"
              width={120}
              height={32}
              objectFit="contain"
            />
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-blue-700 rounded transition-colors duration-200 no-underline">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-blue-700 rounded transition-colors duration-200 no-underline">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-blue-700 rounded transition-colors duration-200 no-underline">Contact</Link>
              {/* Add more links as needed */}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
      <Button variant="secondary">Sign Up</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Login />
        </DialogContent>
      </Dialog>
    </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;