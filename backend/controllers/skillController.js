import asyncHandler from 'express-async-handler';
import Skill from '../models/Skill.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({}).sort({ category: 1, order: 1 });
  res.json(skills);
});

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = asyncHandler(async (req, res) => {
  const { name, level, category, group, order } = req.body;
  let icon = req.body.icon || '';
  if (req.file) {
    icon = req.file.path;
  }

  const skill = await Skill.create({ name, level, category, group, icon, order });
  res.status(201).json(skill);
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  const { name, level, category, group, order } = req.body;

  skill.name = name || skill.name;
  skill.level = level ?? skill.level;
  skill.category = category || skill.category;
  skill.group = group !== undefined ? group : skill.group;
  skill.order = order ?? skill.order;
  if (req.file) {
    skill.icon = req.file.path;
  } else if (req.body.icon !== undefined) {
    skill.icon = req.body.icon;
  }

  const updatedSkill = await skill.save();
  res.json(updatedSkill);
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    res.status(404);
    throw new Error('Skill not found');
  }

  await Skill.deleteOne({ _id: req.params.id });
  res.json({ message: 'Skill removed' });
});

export { getSkills, createSkill, updateSkill, deleteSkill };
