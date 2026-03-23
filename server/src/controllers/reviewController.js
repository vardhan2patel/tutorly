import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import TutorProfile from '../models/TutorProfile.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { tutorId, rating, comment } = req.body;

  const review = new Review({
    tutor: tutorId,
    student: req.user._id,
    rating: Number(rating),
    comment,
  });

  await review.save();

  // Update tutor profile stats
  const reviews = await Review.find({ tutor: tutorId });
  const numReviews = reviews.length;
  const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  await TutorProfile.findOneAndUpdate(
    { user: tutorId },
    { averageRating, numReviews }
  );

  res.status(201).json(review);
});

// @desc    Get tutor reviews
// @route   GET /api/reviews/tutor/:tutorId
// @access  Public
const getTutorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ tutor: req.params.tutorId })
    .populate('student', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export { createReview, getTutorReviews };
