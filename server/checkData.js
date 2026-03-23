import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TutorProfile from './src/models/TutorProfile.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await TutorProfile.countDocuments();
    console.log(`Total Tutors: ${count}`);

    const activeCount = await TutorProfile.countDocuments({ isActive: true });
    console.log(`Active Tutors: ${activeCount}`);

    const tutors = await TutorProfile.find().limit(5);
    console.log('Sample Tutors:', JSON.stringify(tutors, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
