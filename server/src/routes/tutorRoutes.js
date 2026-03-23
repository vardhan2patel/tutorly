import express from 'express';
import {
  upsertTutorProfile,
  getMyTutorProfile,
  getTutorProfileById,
  getNearbyTutors,
} from '../controllers/tutorController.js';
import { protect, tutor } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/profile').post(protect, tutor, upsertTutorProfile);
router.route('/profile/me').get(protect, tutor, getMyTutorProfile);
router.route('/nearby').get(getNearbyTutors);
router.route('/:id').get(getTutorProfileById);

export default router;
