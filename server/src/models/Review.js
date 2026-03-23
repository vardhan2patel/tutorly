import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxLength: 1000 },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
