import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { title, description, link, githubLink, technologies } = req.body;

  const project = new Project({
    title,
    description,
    link,
    githubLink,
    techStack: technologies ? JSON.parse(technologies) : [],
  });

  if (req.file) {
    project.image = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    project.imagePublicId = req.file.filename;
  }

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, link, githubLink, technologies } = req.body;

  project.title = title || project.title;
  project.description = description || project.description;
  project.link = link || project.link;
  project.githubLink = githubLink || project.githubLink;
  project.techStack = technologies ? JSON.parse(technologies) : project.techStack;

  if (req.file) {
    // Delete old image from Cloudinary if configured
    if (isCloudinaryConfigured && project.imagePublicId) {
      try {
        const { cloudinary } = await import('../config/cloudinary.js');
        await cloudinary.uploader.destroy(project.imagePublicId);
      } catch { /* ignore */ }
    }
    project.image = isCloudinaryConfigured ? req.file.path : `/uploads/${req.file.filename}`;
    project.imagePublicId = req.file.filename;
  }

  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Delete image from Cloudinary if configured
  if (isCloudinaryConfigured && project.imagePublicId) {
    try {
      const { cloudinary } = await import('../config/cloudinary.js');
      await cloudinary.uploader.destroy(project.imagePublicId);
    } catch { /* ignore */ }
  }

  await Project.deleteOne({ _id: req.params.id });
  res.json({ message: 'Project removed' });
});

export { getProjects, createProject, updateProject, deleteProject };
