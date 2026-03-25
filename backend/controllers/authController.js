import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Seed an admin user (use once, then remove or protect)
// @route   POST /api/auth/seed-admin
// @access  Public (one-time setup)
const seedAdmin = asyncHandler(async (req, res) => {
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    res.status(400);
    throw new Error('Admin user already exists');
  }

  const admin = await User.create({
    name: 'Suraj',
    email: 'surajprak101@gmail.com',
    password: 'suraj123',
    role: 'admin',
  });

  res.status(201).json({
    message: 'Admin user created',
    email: admin.email,
    defaultPassword: 'admin123456',
  });
});

export { registerUser, loginUser, getMe, seedAdmin };
