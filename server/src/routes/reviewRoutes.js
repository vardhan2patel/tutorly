import express from 'express';
import { createReview, getTutorReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/tutor/:tutorId').get(getTutorReviews);

export default router;
