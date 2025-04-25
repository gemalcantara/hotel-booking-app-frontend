# Hotel Booking System

A responsive and accessible React application for hotel room booking built with Next.js, TypeScript, React Hook Form, and Tailwind CSS.

## Features

- **Form Management**: Uses React Hook Form for efficient form state management
- **Date Selection**: Integrates with react-datepicker for date selection with disabled dates
- **Validation**: Client-side validation with Yup schema validation
- **API Integration**: Connects to backend APIs for room data and booking submission
- **State Management**: Uses React Context API for global state management
- **Responsive Design**: Fully responsive UI with Tailwind CSS
- **Accessibility**: ARIA-compliant form with keyboard navigation support
- **Loading States**: Visual feedback during API requests with loading spinners
- **Error Handling**: User-friendly error messages for form validation and API errors

## Tech Stack

- **Framework**: Next.js with React 18
- **Language**: TypeScript
- **Form Management**: React Hook Form with Yup validation
- **Date Picker**: React DatePicker
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/           
│   └── BookingForm.tsx   # Booking form component
├── context/              
│   └── BookingContext.tsx # Global state context
└── services/             
    └── ApiService.ts     # API integration service
```

## Component Details

### BookingContext.tsx

Provides global state management for:
- Room data
- Selected room information
- Form data
- Loading states
- Error/success messages
- Unavailable dates for rooms

### ApiService.ts

Handles all API interactions:
- Fetching available rooms
- Getting unavailable dates for a specific room
- Submitting booking data

### BookingForm.tsx

The main form component with:
- Form fields with validation
- Date pickers with unavailable date handling
- Room selection
- Promo code support
- Loading spinners
- Success/error messages
- Responsive layout

## API Endpoints

The application interacts with the following endpoints:

- `GET /api/rooms` - Fetches available rooms
- `GET /api/rooms/{id}/unavailable-dates` - Gets booked dates for a specific room
- `POST /api/bookings` - Creates a new booking

## Form Validation

The form validates the following:
- Guest name (required)
- Room selection (required)
- Check-in date (required, must be today or future date)
- Check-out date (required, must be after check-in date)
- Promo code (optional)

## Accessibility Features

- Proper label associations with form controls
- ARIA attributes for validation errors
- Keyboard navigation support
- Disabled states for unavailable dates
- Focus management for error states

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm run start
```

## Future Enhancements

Potential future improvements:
- Add unit and integration tests
- Implement multi-step booking process
- Add room image gallery
- Implement user authentication
- Add booking management for users
- Implement payment processing
- Add internationalization support
