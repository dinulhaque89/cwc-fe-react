# CWC Taxi Booking Service

Welcome to the CWC Taxi Booking Service! This project is a functional, taxi booking application developed using Next.js 14 and styled with Shadcn UI. It connects to a backend built with Python Flask and a PostgreSQL database, hosted on Heroku.

## Features

- **Dynamic Map Integration**: Utilizes Google Maps API for real-time location tracking and routing.
- **User Authentication**: Supports secure login and registration functionality for passengers and drivers.
- **Booking Management**: Allows passengers to book rides, view booking history, and manage ongoing trips.
- **Review System**: Enables users to provide feedback on their journeys, enhancing service quality.
- **Responsive Design**: Built with mobile-first approach ensuring a seamless experience across all devices.
- **Accessibility**: Focuses on accessibility to make the app usable for everyone.

## Project Structure

The project includes several key React components and configurations:

- `BookRide.tsx`: Component for booking a taxi.
- `ChangePassword.tsx`: Allows users to change their password.
- `UpdateDetails.tsx`: Component for updating user profiles.
- `ViewBookings.tsx`: Enables users to view their booking history.
- `ViewReviews.tsx`: Displays reviews from users.
- `Map.tsx`: Integrates Google Maps for real-time tracking and location selection.
- `Navbar.tsx`: Navigation bar for easy access to different sections of the application.
- `tailwind.config.ts`: TailwindCSS configuration for styling.
- `package.json`: Manages project dependencies and scripts.

## Getting Started

### Prerequisites

- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dinulhaque89/cwc-fe-react.git
   cd cwc-fe-react
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
or
   ```bash
   yarn dev
   ```
or
   ```bash
   pnpm dev
   ```
or
   ```bash
   bun dev
   ```

Visit http://localhost:3000 to view the application.

## Usage
Navigate through the application to book rides, manage bookings, update personal details, and submit reviews.


## Contributing
We welcome contributions to the CWC Taxi Booking Service. To contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/YourFeature).
3. Make your changes and commit them (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature/YourFeature).
5. Open a pull request.

