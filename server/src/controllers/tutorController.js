import asyncHandler from 'express-async-handler';
import TutorProfile from '../models/TutorProfile.js';

// @desc    Create or update tutor profile
// @route   POST /api/tutors/profile
// @access  Private/Tutor
const upsertTutorProfile = asyncHandler(async (req, res) => {
  const {
    photoUrl,
    phoneNumber,
    bio,
    subjects,
    classLevels,
    experienceYears,
    availability,
    latitude,
    longitude,
  } = req.body;

  const profileFields = {
    user: req.user._id,
    photoUrl,
    phoneNumber,
    bio,
    subjects,
    classLevels,
    experienceYears,
    availability,
  };

  // Add location if coordinates are provided
  if (latitude && longitude) {
    profileFields.location = {
      type: 'Point',
      coordinates: [longitude, latitude], // MongoDB expects [lng, lat]
    };
  }

  let profile = await TutorProfile.findOne({ user: req.user._id });

  if (profile) {
    // Update
    profile = await TutorProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
    return res.json(profile);
  }

  // Create
  profile = new TutorProfile(profileFields);
  await profile.save();
  res.status(201).json(profile);
});

// @desc    Get current tutor profile
// @route   GET /api/tutors/profile/me
// @access  Private/Tutor
const getMyTutorProfile = asyncHandler(async (req, res) => {
  const profile = await TutorProfile.findOne({ user: req.user._id }).populate('user', ['name', 'email']);

  if (!profile) {
    res.status(404);
    throw new Error('There is no profile for this user');
  }

  res.json(profile);
});

// @desc    Get tutor profile by ID
// @route   GET /api/tutors/:id
// @access  Public
const getTutorProfileById = asyncHandler(async (req, res) => {
  const profile = await TutorProfile.findOne({ user: req.params.id }).populate('user', ['name']);

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.json(profile);
});

// @desc    Get tutors within 10km radius (or specified) with advanced filters
// @route   GET /api/tutors/nearby
// @access  Public
const getNearbyTutors = asyncHandler(async (req, res) => {
  const { lat, lng, subject, classLevel, maxDistance } = req.query;
  
  if (!lat || !lng) {
    res.status(400);
    throw new Error('Please provide latitude and longitude');
  }

  // Base query for active tutors
  const matchQuery = { isActive: true };

  // Advanced Filtering
  if (subject) {
    // case-insensitive match for the subject
    matchQuery.subjects = { $regex: new RegExp(subject, 'i') };
  }
  
  if (classLevel) {
    matchQuery.classLevels = classLevel;
  }

  // Allow custom distance, default to 10km (10000 meters)
  const distanceLimit = maxDistance ? parseInt(maxDistance) : 10000;

  const tutors = await TutorProfile.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        distanceField: 'distance', // Distance will be in meters
        maxDistance: distanceLimit,
        spherical: true,
        query: matchQuery
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        'user.password': 0 // Hide password hash
      }
    }
  ]);

  res.json(tutors);
});

export { upsertTutorProfile, getMyTutorProfile, getTutorProfileById, getNearbyTutors };
