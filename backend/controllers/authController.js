const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id, email, role, approved) => {
  return jwt.sign(
    { id, email, role, approved },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, cnic, mobileNumber, age, isSuperiorEmail } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      cnic,
      mobileNumber,
      age: age ? parseInt(age) : undefined,
      isSuperiorEmail: !!isSuperiorEmail, // Auto-approve if it's a superior email
      verified: true, // In new system, verification is handled separately
      approved: isSuperiorEmail || false, // Auto-approve superior emails
      role: 'user'
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role, user.approved);

    res.status(201).json({
      success: true,
      message: isSuperiorEmail 
        ? 'User registered and auto-approved successfully' 
        : 'User registered successfully. Please wait for admin approval.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if user is approved
    if (!user.approved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account awaiting admin approval' 
      });
    }

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role, user.approved);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        verified: req.user.verified,
        approved: req.user.approved
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user data' 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};