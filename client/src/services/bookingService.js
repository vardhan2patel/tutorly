import api from './api';

export const createBooking = async (tutorId, date, durationMinutes) => {
  const { data } = await api.post('/bookings', { tutorId, date, durationMinutes });
  return data;
};

export const getMyBookings = async () => {
  const { data } = await api.get('/bookings/me');
  return data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const { data } = await api.put(`/bookings/${bookingId}/status`, { status });
  return data;
};
