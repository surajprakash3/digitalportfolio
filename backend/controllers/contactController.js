import asyncHandler from 'express-async-handler';
import Contact from '../models/Contact.js';

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const contact = await Contact.create({ name, email, subject, message });
  res.status(201).json({ message: 'Message sent successfully', contact });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.json({ message: 'Message deleted' });
});

// @desc    Mark a contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private
const markContactAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }

  contact.read = true;
  await contact.save();
  res.json({ message: 'Message marked as read', contact });
});

export { submitContact, getContacts, deleteContact, markContactAsRead };
