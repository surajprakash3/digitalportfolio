import asyncHandler from 'express-async-handler';
import Social from '../models/Social.js';
import cloudinary from 'cloudinary';

// @desc    Get all socials
// @route   GET /api/socials
// @access  Public
const getSocials = asyncHandler(async (req, res) => {
  const socials = await Social.find({}).sort({ createdAt: 1 });
  res.json(socials);
});

// @desc    Create a social link
// @route   POST /api/socials
// @access  Private
const createSocial = asyncHandler(async (req, res) => {
  const { platform, handle, url, category } = req.body;

  const social = new Social({
    platform,
    handle,
    url,
    category
  });

  if (req.file) {
    social.icon = req.file.path;
    social.iconPublicId = req.file.filename;
  }

  const createdSocial = await social.save();
  res.status(201).json(createdSocial);
});

// @desc    Update a social link
// @route   PUT /api/socials/:id
// @access  Private
const updateSocial = asyncHandler(async (req, res) => {
  const social = await Social.findById(req.params.id);

  if (!social) {
    res.status(404);
    throw new Error('Social link not found');
  }

  const { platform, handle, url, category } = req.body;

  social.platform = platform || social.platform;
  social.handle = handle || social.handle;
  social.url = url || social.url;
  social.category = category || social.category;

  if (req.file) {
    // Delete old icon
    if (social.iconPublicId) {
      await cloudinary.v2.uploader.destroy(social.iconPublicId);
    }
    social.icon = req.file.path;
    social.iconPublicId = req.file.filename;
  }

  const updatedSocial = await social.save();
  res.json(updatedSocial);
});

// @desc    Delete a social link
// @route   DELETE /api/socials/:id
// @access  Private
const deleteSocial = asyncHandler(async (req, res) => {
  const social = await Social.findById(req.params.id);

  if (!social) {
    res.status(404);
    throw new Error('Social link not found');
  }

  // Delete icon from Cloudinary
  if (social.iconPublicId) {
    await cloudinary.v2.uploader.destroy(social.iconPublicId);
  }

  await social.deleteOne();
  res.json({ message: 'Social link removed' });
});

export {
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
};
