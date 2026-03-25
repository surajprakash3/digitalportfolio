import asyncHandler from 'express-async-handler';
import Experience from '../models/Experience.js';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

// @desc    Get all experience entries
// @route   GET /api/experience
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({}).sort({ createdAt: -1 });
  res.json(experiences);
});

// @desc    Create an experience entry
// @route   POST /api/experience
// @access  Private
const createExperience = asyncHandler(async (req, res) => {
  const { 
    type, company, role, duration, location, locationType, employmentType, 
    description, skills, link, degree, fieldOfStudy, grade, activities 
  } = req.body;

  const experience = new Experience({
    type: type || 'work',
    company,
    role,
    duration,
    location,
    locationType,
    employmentType,
    description,
    skills: skills ? JSON.parse(skills) : [],
    link,
    degree,
    fieldOfStudy,
    grade,
    activities
  });

  if (req.file) {
    experience.logo = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    experience.logoPublicId = req.file.filename;
  }

  const createdExperience = await experience.save();
  res.status(201).json(createdExperience);
});

// @desc    Update an experience entry
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  const { 
    type, company, role, duration, location, locationType, employmentType, 
    description, skills, link, degree, fieldOfStudy, grade, activities 
  } = req.body;

  experience.type = type || experience.type;
  experience.company = company || experience.company;
  experience.role = role || experience.role;
  experience.duration = duration || experience.duration;
  experience.location = location !== undefined ? location : experience.location;
  experience.locationType = locationType !== undefined ? locationType : experience.locationType;
  experience.employmentType = employmentType !== undefined ? employmentType : experience.employmentType;
  experience.description = description || experience.description;
  experience.skills = skills ? JSON.parse(skills) : experience.skills;
  experience.link = link !== undefined ? link : experience.link;
  
  // Education fields
  experience.degree = degree !== undefined ? degree : experience.degree;
  experience.fieldOfStudy = fieldOfStudy !== undefined ? fieldOfStudy : experience.fieldOfStudy;
  experience.grade = grade !== undefined ? grade : experience.grade;
  experience.activities = activities !== undefined ? activities : experience.activities;

  if (req.file) {
    // Delete old logo if configured
    if (isCloudinaryConfigured && experience.logoPublicId) {
      try {
        const { cloudinary } = await import('../config/cloudinary.js');
        await cloudinary.uploader.destroy(experience.logoPublicId);
      } catch { /* ignore */ }
    }
    experience.logo = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    experience.logoPublicId = req.file.filename;
  }

  const updatedExperience = await experience.save();
  res.json(updatedExperience);
});

// @desc    Delete an experience entry
// @route   DELETE /api/experience/:id
// @access  Private
const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  // Delete logo if configured
  if (isCloudinaryConfigured && experience.logoPublicId) {
    try {
      const { cloudinary } = await import('../config/cloudinary.js');
      await cloudinary.uploader.destroy(experience.logoPublicId);
    } catch { /* ignore */ }
  }

  await Experience.deleteOne({ _id: req.params.id });
  res.json({ message: 'Experience removed' });
});

export { getExperiences, createExperience, updateExperience, deleteExperience };
