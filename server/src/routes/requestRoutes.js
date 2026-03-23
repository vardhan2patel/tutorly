import express from 'express';
import {
  createContactRequest,
  getTutorRequests,
  getUserRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect, tutor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createContactRequest);
router.route('/me').get(protect, getUserRequests);
router.route('/tutor').get(protect, tutor, getTutorRequests);
router.route('/:id/status').put(protect, tutor, updateRequestStatus);

export default router;
