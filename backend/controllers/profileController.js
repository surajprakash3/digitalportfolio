import 'dotenv/config';
import asyncHandler from 'express-async-handler';
import Profile from '../models/Profile.js';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// @desc    Get profile (public)
// @route   GET /api/profile
// @access  Public
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  // Create default profile if none exists
  if (!profile) {
    profile = await Profile.create({});
  }

  res.json(profile);
});

// @desc    Update profile (admin only)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = new Profile();
  }

  if (req.body.hero) {
    try {
      const parsedHero = typeof req.body.hero === 'string' ? JSON.parse(req.body.hero) : req.body.hero;
      profile.hero = { ...profile.hero?.toObject ? profile.hero.toObject() : profile.hero, ...parsedHero };
    } catch (e) { console.error('Error parsing hero', e); }
  }

  if (req.body.about) {
    try {
      const parsedAbout = typeof req.body.about === 'string' ? JSON.parse(req.body.about) : req.body.about;
      profile.about = { ...profile.about?.toObject ? profile.about.toObject() : profile.about, ...parsedAbout };
    } catch (e) { console.error('Error parsing about', e); }
  }

  if (req.body.socials) {
    try {
      const parsedSocials = typeof req.body.socials === 'string' ? JSON.parse(req.body.socials) : req.body.socials;
      profile.socials = { ...profile.socials?.toObject ? profile.socials.toObject() : profile.socials, ...parsedSocials };
    } catch (e) { console.error('Error parsing socials', e); }
  }

  // Handle profile image upload
  if (req.file) {
    if (isCloudinaryConfigured) {
      if (profile.hero?.profileImagePublicId) {
        try {
          const { cloudinary } = await import('../config/cloudinary.js');
          await cloudinary.uploader.destroy(profile.hero.profileImagePublicId);
        } catch { /* ignore cleanup errors */ }
      }
      profile.hero.profileImage = req.file.path;
      profile.hero.profileImagePublicId = req.file.filename;
    } else {
      profile.hero.profileImage = `/uploads/${req.file.filename}`;
      profile.hero.profileImagePublicId = '';
    }
  }

  const updatedProfile = await profile.save();
  res.json(updatedProfile);
});

export { getProfile, updateProfile };
