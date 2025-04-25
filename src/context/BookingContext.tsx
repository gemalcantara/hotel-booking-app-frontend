"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our booking data
export interface Room {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BookingFormData {
  guest_name: string;
  room_id: string;
  check_in_date: Date | null;
  check_out_date: Date | null;
  promo_code?: string;
}

interface BookingContextType {
  rooms: Room[];
  selectedRoom: Room | null;
  bookingData: BookingFormData;
  unavailableDates: Date[];
  isLoading: boolean;
  error: string | null;
  success: string | null;
  setRooms: (rooms: Room[]) => void;
  setSelectedRoom: (room: Room | null) => void;
  setBookingData: (data: Partial<BookingFormData>) => void;
  setUnavailableDates: (dates: Date[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const initialFormData: BookingFormData = {
  guest_name: '',
  room_id: '',
  check_in_date: null,
  check_out_date: null,
  promo_code: '',
};

// Create the context with default values
const BookingContext = createContext<BookingContextType>({
  rooms: [],
  selectedRoom: null,
  bookingData: initialFormData,
  unavailableDates: [],
  isLoading: false,
  error: null,
  success: null,
  setRooms: () => {},
  setSelectedRoom: () => {},
  setBookingData: () => {},
  setUnavailableDates: () => {},
  setIsLoading: () => {},
  setError: () => {},
  setSuccess: () => {},
});

// Create a provider component
export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingData, setBookingDataState] = useState<BookingFormData>(initialFormData);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const setBookingData = (data: Partial<BookingFormData>) => {
    setBookingDataState(prev => ({ ...prev, ...data }));
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        selectedRoom,
        bookingData,
        unavailableDates,
        isLoading,
        error,
        success,
        setRooms,
        setSelectedRoom,
        setBookingData,
        setUnavailableDates,
        setIsLoading,
        setError,
        setSuccess,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Create a custom hook to use the booking context
export const useBooking = () => useContext(BookingContext);