import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Student)
const createBooking = asyncHandler(async (req, res) => {
  const { tutorId, date, durationMinutes } = req.body;

  if (new Date(date) < new Date()) {
    res.status(400);
    throw new Error('Booking date must be in the future');
  }

  const booking = new Booking({
    student: req.user._id,
    tutor: tutorId,
    date,
    durationMinutes,
  });

  await booking.save();
  res.status(201).json(booking);
});

// @desc    Get bookings for the logged-in user (Student or Tutor)
// @route   GET /api/bookings/me
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  // Query depends on user role
  const query = req.user.role === 'tutor' 
    ? { tutor: req.user._id } 
    : { student: req.user._id };

  const bookings = await Booking.find(query)
    .populate('tutor', 'name')
    .populate('student', 'name')
    .sort({ date: 1 });

  res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure only the involved parties can update
  if (booking.tutor.toString() !== req.user._id.toString() && booking.student.toString() !== req.user._id.toString()) {
     res.status(401);
     throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
});

export { createBooking, getMyBookings, updateBookingStatus };
