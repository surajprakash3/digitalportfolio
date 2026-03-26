import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const profileSchema = new mongoose.Schema({
  hero: {
    profileImage: String,
    fullName: String,
    profileImagePublicId: String
  }
}, { strict: false });

const Profile = mongoose.model('Profile', profileSchema);

async function checkProfile() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const profile = await Profile.findOne();
    console.log('--- PROFILE DATA ---');
    console.log(JSON.stringify(profile, null, 2));
    console.log('--- END ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkProfile();
