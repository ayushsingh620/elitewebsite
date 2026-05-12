const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact — Submit a new contact form
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Validate all fields are present
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Please fill out the entire form.'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Create and save contact
    const newContact = new Contact({
      name,
      email,
      phone,
      service,
      message
    });

    await newContact.save();

    return res.status(201).json({
      success: true,
      message: 'Your message has been received. We will contact you within 24 hours.'
    });
  } catch (err) {
    console.error('Contact form error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// GET /api/contacts — Retrieve all contacts (admin use)
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    console.error('Fetch contacts error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

module.exports = router;
