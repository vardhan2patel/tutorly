import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/me').get(protect, getMyBookings);
router.route('/:id/status').put(protect, updateBookingStatus);

export default router;
