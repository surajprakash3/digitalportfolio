import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Profile from './models/Profile.js';
import fs from 'fs';

dotenv.config();
fs.writeFileSync('script_alive.txt', 'started');

const checkProfile = async () => {
  try {
    fs.appendFileSync('script_alive.txt', '\nconnecting...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    fs.appendFileSync('script_alive.txt', '\nconnected');
    const profile = await Profile.findOne();
    fs.writeFileSync('profile_dump.json', JSON.stringify(profile, null, 2));
    process.exit(0);
  } catch (error) {
    fs.writeFileSync('error.log', error.message);
    process.exit(1);
  }
};

checkProfile();
