import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  message: { type: String, maxLength: 1000 }
}, { timestamps: true });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);
export default ContactRequest;
