import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import ContactRequest from '../models/ContactRequest.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { requestId, content } = req.body;

  const contactRequest = await ContactRequest.findById(requestId);

  if (!contactRequest || contactRequest.status !== 'accepted') {
    res.status(400);
    throw new Error('Can only send messages for accepted contact requests');
  }

  // Determine receiver based on sender
  const receiverId = req.user._id.toString() === contactRequest.student.toString() 
    ? contactRequest.tutor 
    : contactRequest.student;

  const message = new Message({
    sender: req.user._id,
    receiver: receiverId,
    contactRequest: requestId,
    content,
  });

  await message.save();
  await message.populate('sender', 'name');

  res.status(201).json(message);
});

// @desc    Get messages for a request
// @route   GET /api/messages/:requestId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ contactRequest: req.params.requestId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 });

  // Mark all unread messages as read for the current user
  await Message.updateMany(
    { contactRequest: req.params.requestId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.json(messages);
});

export { sendMessage, getMessages };
