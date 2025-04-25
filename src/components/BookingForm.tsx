"use client"

import React, { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBooking, BookingFormData } from '../context/BookingContext';
import { ApiService } from '../services/ApiService';

// Form validation schema with proper types
const schema = yup.object().shape({
  guest_name: yup.string().required('Guest name is required'),
  room_id: yup.string().required('Please select a room'),
  check_in_date: yup.date().required('Check-in date is required').nullable(),
  check_out_date: yup
    .date()
    .min(
      yup.ref('check_in_date'),
      'Check-out date must be after check-in date'
    )
    .required('Check-out date is required')
    .nullable(),
  promo_code: yup.string()
    .optional()
    .matches(/^[A-Z0-9]{6,10}$/, 'Promo code must be uppercase alphanumeric and between 6-10 characters'),
});

// Type for the form
type BookingFormValues = {
  guest_name: string;
  room_id: string;
  check_in_date: Date | null;
  check_out_date: Date | null;
  promo_code?: string;
};

// Type for API field errors
type ApiFieldErrors = {
  [key: string]: string[];
};

const BookingForm: React.FC = () => {
  const {
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
  } = useBooking();

  // State to store field-specific errors from API
  const [apiFieldErrors, setApiFieldErrors] = useState<ApiFieldErrors>({});

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError: setFormError,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: bookingData,
  });

  const selectedroom_id = watch('room_id');
  const selectedcheck_in_date = watch('check_in_date');

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const roomsData = await ApiService.getRooms();
        console.log(roomsData);
        setRooms(roomsData);
      } catch (err) {
        setError('Failed to load rooms. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [setRooms, setIsLoading, setError]);

  // Fetch unavailable dates when room selection changes
  useEffect(() => {
    if (!selectedroom_id) return;

    const fetchUnavailableDates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const dates = await ApiService.getUnavailableDates(selectedroom_id);
        setUnavailableDates(dates);
        
        // Find and set the selected room
        const room = rooms.find(room => room.id === selectedroom_id) || null;
        setSelectedRoom(room);
      } catch (err) {
        setError('Failed to load availability. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnavailableDates();
  }, [selectedroom_id, rooms, setUnavailableDates, setIsLoading, setError, setSelectedRoom]);

  // Handle form submission
  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setApiFieldErrors({}); // Clear previous API field errors
      await ApiService.createBooking(data as BookingFormData);
      setSuccess('Booking created successfully!');
      setBookingData(data as BookingFormData);
    } catch (err: any) {
      // Handle structured validation errors from the API
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors as ApiFieldErrors;
        setApiFieldErrors(apiErrors);
        
        // Set the general error message
        setError(err.response.data.message || 'Validation failed');
        
        // Set field-specific errors in the form
        Object.entries(apiErrors).forEach(([field, messages]) => {
          if (field in data && messages.length > 0) {
            setFormError(field as keyof BookingFormValues, { 
              type: 'manual',
              message: messages[0]
            });
          }
        });
      } else {
        // Set a general error message if no structured error
        setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(
      unavailableDate =>
        unavailableDate.getFullYear() === date.getFullYear() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getDate() === date.getDate()
    );
  };

  // Helper function to get field error message (from form validation or API)
  const getFieldErrorMessage = (fieldName: string) => {
    // Check form validation errors first
    if (errors[fieldName as keyof BookingFormValues]) {
      return errors[fieldName as keyof BookingFormValues]?.message;
    }
    
    // Then check API field errors
    if (apiFieldErrors[fieldName] && apiFieldErrors[fieldName].length > 0) {
      return apiFieldErrors[fieldName][0];
    }
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black text-center">Book Your Stay</h2>
      
      {/* Success and Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Guest Name Field */}
        <div>
          <label htmlFor="guest_name" className="block text-sm font-medium text-black mb-1">
            Guest Name
          </label>
          <input
            id="guest_name"
            type="text"
            {...register('guest_name')}
            className={`w-full px-3 py-2 border ${getFieldErrorMessage('guest_name') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500`}
            aria-invalid={getFieldErrorMessage('guest_name') ? 'true' : 'false'}
            aria-describedby={getFieldErrorMessage('guest_name') ? 'guest_name-error' : undefined}
          />
          {getFieldErrorMessage('guest_name') && (
            <p id="guest_name-error" className="mt-1 text-sm text-red-600">
              {getFieldErrorMessage('guest_name')}
            </p>
          )}
        </div>
        
        {/* Room Selection Field */}
        <div>
          <label htmlFor="room_id" className="block text-sm font-medium text-black mb-1">
            Room
          </label>
          <select
            id="room_id"
            {...register('room_id')}
            className={`w-full px-3 py-2 border ${getFieldErrorMessage('room_id') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500`}
            aria-invalid={getFieldErrorMessage('room_id') ? 'true' : 'false'}
            aria-describedby={getFieldErrorMessage('room_id') ? 'room_id-error' : undefined}
          >
            <option value="">Select a room</option>
            {Array.isArray(rooms) && rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name} - ${room.price}/night
              </option>
            ))}
          </select>
          {getFieldErrorMessage('room_id') && (
            <p id="room_id-error" className="mt-1 text-sm text-red-600">
              {getFieldErrorMessage('room_id')}
            </p>
          )}
        </div>
        
        {/* Check-in Date Field */}
        <div>
          <label htmlFor="check_in_date" className="block text-sm font-medium text-black mb-1">
            Check-in Date
          </label>
          <Controller
            control={control}
            name="check_in_date"
            render={({ field }) => (
              <DatePicker
                id="check_in_date"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className={`w-full px-3 py-2 border ${getFieldErrorMessage('check_in_date') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500`}
                dateFormat="MM/dd/yyyy"
                minDate={new Date()}
                filterDate={(date) => !isDateUnavailable(date)}
                placeholderText="Select check-in date"
                aria-invalid={getFieldErrorMessage('check_in_date') ? 'true' : 'false'}
                aria-describedby={getFieldErrorMessage('check_in_date') ? 'check_in_date-error' : undefined}
              />
            )}
          />
          {getFieldErrorMessage('check_in_date') && (
            <p id="check_in_date-error" className="mt-1 text-sm text-red-600">
              {getFieldErrorMessage('check_in_date')}
            </p>
          )}
        </div>
        
        {/* Check-out Date Field */}
        <div>
          <label htmlFor="check_out_date" className="block text-sm font-medium text-black mb-1">
            Check-out Date
          </label>
          <Controller
            control={control}
            name="check_out_date"
            render={({ field }) => (
              <DatePicker
                id="check_out_date"
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className={`w-full px-3 py-2 border ${getFieldErrorMessage('check_out_date') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500`}
                dateFormat="MM/dd/yyyy"
                minDate={selectedcheck_in_date || new Date()}
                filterDate={(date) => !isDateUnavailable(date)}
                placeholderText="Select check-out date"
                aria-invalid={getFieldErrorMessage('check_out_date') ? 'true' : 'false'}
                aria-describedby={getFieldErrorMessage('check_out_date') ? 'check_out_date-error' : undefined}
                disabled={!selectedcheck_in_date}
              />
            )}
          />
          {getFieldErrorMessage('check_out_date') && (
            <p id="check_out_date-error" className="mt-1 text-sm text-red-600">
              {getFieldErrorMessage('check_out_date')}
            </p>
          )}
        </div>
        
        {/* Promo Code Field */}
        <div>
          <label htmlFor="promo_code" className="block text-sm font-medium text-black mb-1">
            Promo Code (Optional)
          </label>
          <input
            id="promo_code"
            type="text"
            {...register('promo_code')}
            className={`w-full px-3 py-2 border ${getFieldErrorMessage('promo_code') ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none text-black focus:ring-2 focus:ring-blue-500`}
            aria-invalid={getFieldErrorMessage('promo_code') ? 'true' : 'false'}
            aria-describedby={getFieldErrorMessage('promo_code') ? 'promo_code-error' : undefined}
            placeholder="6-10 uppercase letters or numbers"
          />
          {getFieldErrorMessage('promo_code') && (
            <p id="promo_code-error" className="mt-1 text-sm text-red-600">
              {getFieldErrorMessage('promo_code')}
            </p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            'Book Now'
          )}
        </button>
      </form>
      
      {/* Selected Room Information */}
      {selectedRoom && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold">Selected Room</h3>
          <p className="mt-2">{selectedRoom.name}</p>
          <p className="text-black">${selectedRoom.price} per night</p>
          <p className="mt-2 text-black">{selectedRoom.description}</p>
        </div>
      )}
    </div>
  );
};

export default BookingForm;