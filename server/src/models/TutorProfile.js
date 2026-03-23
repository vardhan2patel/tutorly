import mongoose from 'mongoose';

const tutorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  photoUrl: { type: String, default: '' },
  phoneNumber: { type: String },
  bio: { type: String, maxLength: 500 },
  subjects: [{ type: String }],
  classLevels: [{ type: String }],
  experienceYears: { type: Number, default: 0 },
  availability: { type: String },
  
  // Rating stats
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  
  // GEOSPATIAL DATA FOR RADIUS SEARCH
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

tutorProfileSchema.index({ location: '2dsphere' });

const TutorProfile = mongoose.model('TutorProfile', tutorProfileSchema);
export default TutorProfile;
