const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const { protect, JWT_SECRET } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user or request platform access
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, avatar, requestReason } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    // Create user with status 'pending_approval' for restricted access control
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      phone: phone || '+1 (555) 019-2834',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'pending_approval',
      requestReason: requestReason || 'Matrimonial matching & event booking access.'
    });

    if (user.role === 'user') {
      await Profile.create({
        user: user._id,
        gender: 'female',
        age: 25,
        religion: 'Hindu',
        occupation: 'Software Engineer',
        annualIncome: 90000,
        education: 'Bachelor of Technology',
        city: 'San Francisco',
        bio: `Hello! I am ${user.name}. Looking for a like-minded partner.`,
        photos: [user.avatar]
      });
    }

    // Notify Admin users of new access request
    const admins = await User.find({ role: 'admin' });
    for (let admin of admins) {
      await Notification.create({
        user: admin._id,
        title: 'New Access Request Pending Approval! 🛡️',
        message: `${user.name} (${user.email}) submitted a new access request.`,
        type: 'verification'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Access request submitted successfully! Your account is pending Admin approval.',
      status: 'pending_approval',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & check approval status
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (user.status === 'pending_approval') {
      return res.status(403).json({ 
        success: false, 
        error: 'Your access request is currently PENDING Admin approval. Please wait for an administrator to approve your account.' 
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, error: 'Account suspended. Contact administration.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile & role details
router.get('/me', protect, async (req, res) => {
  try {
    let profile = null;
    let vendor = null;

    if (req.user.role === 'user') {
      profile = await Profile.findOne({ user: req.user._id });
    } else if (req.user.role === 'vendor') {
      vendor = await Vendor.findOne({ user: req.user._id });
    }

    res.json({
      success: true,
      user: req.user,
      profile,
      vendor
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// @route   POST /api/auth/switch-demo
// @desc    Login instantly as one of the pre-approved demo personas
router.post('/switch-demo', async (req, res) => {
  try {
    const { role } = req.body;
    let email = 'admin@platform.com';

    if (role === 'user') email = 'ananya@example.com';
    else if (role === 'vendor') email = 'decor@royalblooms.com';
    else if (role === 'lawyer') email = 'contact@marriagelawyer.com';
    else if (role === 'admin') email = 'admin@platform.com';

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: `Demo user for role ${role} not found` });
    }

    // Ensure demo accounts are active
    user.status = 'active';
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
