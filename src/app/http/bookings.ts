import { http } from ".";

export const getUserBookings = () => http.get('/bookings/my');

export const getBookingById = (id: string) => http.get(`/bookings/${id}`);