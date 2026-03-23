import asyncHandler from 'express-async-handler';
import ContactRequest from '../models/ContactRequest.js';
import TutorProfile from '../models/TutorProfile.js';

// @desc    Create a contact request
// @route   POST /api/requests
// @access  Private (Student/Parent)
const createContactRequest = asyncHandler(async (req, res) => {
  const { tutorId, message } = req.body;

  // Ensure tutor exists
  const tutorProfile = await TutorProfile.findOne({ user: tutorId });
  if (!tutorProfile) {
    res.status(404);
    throw new Error('Tutor not found');
  }

  // Ensure we are not sending duplicate pending requests
  const existingRequest = await ContactRequest.findOne({
    student: req.user._id,
    tutor: tutorId,
    status: 'pending',
  });

  if (existingRequest) {
    res.status(400);
    throw new Error('You already have a pending request with this tutor');
  }

  const request = new ContactRequest({
    student: req.user._id,
    tutor: tutorId,
    message,
  });

  await request.save();

  res.status(201).json(request);
});

// @desc    Get incoming requests for a tutor
// @route   GET /api/requests/tutor
// @access  Private/Tutor
const getTutorRequests = asyncHandler(async (req, res) => {
  const requests = await ContactRequest.find({ tutor: req.user._id })
    .populate('student', 'name email')
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Get requests sent by a student
// @route   GET /api/requests/me
// @access  Private
const getUserRequests = asyncHandler(async (req, res) => {
  const requests = await ContactRequest.find({ student: req.user._id })
    .populate('tutor', 'name email')
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private/Tutor
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const request = await ContactRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Ensure only the tutor receiving the request can update it
  if (request.tutor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this request');
  }

  request.status = status;
  await request.save();

  res.json(request);
});

export { createContactRequest, getTutorRequests, getUserRequests, updateRequestStatus };
