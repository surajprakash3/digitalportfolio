import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
}, { timestamps: true }));

// Update the existing user's password and role
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash('suraj123', salt);

const result = await User.findOneAndUpdate(
  { email: 'surajprak101@gmail.com' },
  { password: hashedPassword, role: 'admin', name: 'Suraj Prakash' },
  { new: true, upsert: true }
);

console.log('Admin updated:', result.email, '| Role:', result.role);
await mongoose.disconnect();
