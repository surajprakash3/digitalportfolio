import asyncHandler from 'express-async-handler';
import Certification from '../models/Certification.js';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

// @desc    Get all certifications
// @route   GET /api/certifications
// @access  Public
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({}).sort({ issueDate: -1 });
  res.json(certifications);
});

// @desc    Create a certification
// @route   POST /api/certifications
// @access  Private
const createCertification = asyncHandler(async (req, res) => {
  const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;

  const certification = new Certification({
    name,
    issuer,
    issueDate,
    expiryDate,
    credentialId,
    credentialUrl
  });

  if (req.file) {
    certification.logo = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    certification.logoPublicId = req.file.filename;
  }

  const createdCertification = await certification.save();
  res.status(201).json(createdCertification);
});

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }

  const { name, issuer, issueDate, expiryDate, credentialId, credentialUrl } = req.body;

  certification.name = name || certification.name;
  certification.issuer = issuer || certification.issuer;
  certification.issueDate = issueDate || certification.issueDate;
  certification.expiryDate = expiryDate !== undefined ? expiryDate : certification.expiryDate;
  certification.credentialId = credentialId !== undefined ? credentialId : certification.credentialId;
  certification.credentialUrl = credentialUrl !== undefined ? credentialUrl : certification.credentialUrl;

  if (req.file) {
    // Delete old logo from Cloudinary if configured
    if (isCloudinaryConfigured && certification.logoPublicId) {
      try {
        const { cloudinary } = await import('../config/cloudinary.js');
        await cloudinary.uploader.destroy(certification.logoPublicId);
      } catch { /* ignore cleanup errors */ }
    }
    certification.logo = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    certification.logoPublicId = req.file.filename;
  }

  const updatedCertification = await certification.save();
  res.json(updatedCertification);
});

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Private
const deleteCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.findById(req.params.id);

  if (!certification) {
    res.status(404);
    throw new Error('Certification not found');
  }

  // Delete logo from Cloudinary if configured
  if (isCloudinaryConfigured && certification.logoPublicId) {
    try {
      const { cloudinary } = await import('../config/cloudinary.js');
      await cloudinary.uploader.destroy(certification.logoPublicId);
    } catch { /* ignore cleanup errors */ }
  }

  await certification.deleteOne();
  res.json({ message: 'Certification removed' });
});

export {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
};
