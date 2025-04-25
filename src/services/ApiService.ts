import axios from 'axios';
import { Room, BookingFormData } from '../context/BookingContext';

// API URL - in a real app this would be in an env variable

const API_URL = 'http://localhost:7003/'; // Replace with actual API URL
// API token - hardcoded for simplicity as per requirements
const API_TOKEN = 'Bearer 12345';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`
  }
});

export const ApiService = {
  // Get all available rooms
  async getRooms(): Promise<Room[]> {
    try {
      const response = await api.get('/api/rooms');
      // Handle paginated response structure
      if (response.data && response.data.rooms && Array.isArray(response.data.rooms.data)) {
        return response.data.rooms.data.map((room: any) => ({
          id: room.id.toString(),
          name: `Room ${room.number} (${room.type})`,
          price: room.price || 100, // Default price if not provided in API
          description: `A comfortable ${room.type} room`,
        }));
      }
      // Fallback for backward compatibility or different response structure
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  // Get unavailable dates for a specific room
  async getUnavailableDates(roomId: string): Promise<Date[]> {
    try {
      const response = await api.get(`/api/rooms/${roomId}/unavailable-dates`);
      // Convert string dates to Date objects
      return response.data.map((dateStr: string) => new Date(dateStr));
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
      throw error;
    }
  },

  // Create a new booking
  async createBooking(bookingData: BookingFormData): Promise<any> {
    try {
      const response = await api.post('/api/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
};