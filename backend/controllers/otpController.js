const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendVerificationEmail } = require('../utils/emailService');

// @desc    Send OTP to user's email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Create expiration time (10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const newOTP = new OTP({
      email: email.toLowerCase(),
      otp,
      expiresAt
    });

    await newOTP.save();

    // Send OTP via email
    const emailSent = await sendVerificationEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
      expiresAt: { $gt: new Date() }, // Not expired
      used: false // Not used yet
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Find user and update verification status
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.verified = true;
      // Auto approve if it's a superior email
      if (email.endsWith('@superior.edu.pk')) {
        user.approved = true;
      }
      await user.save();

      // Send approval email if auto-approved
      if (user.approved) {
        await require('../utils/emailService').sendApprovalEmail(user.email, user.name);
      }
    }

    res.status(200).json({
      success: true,
      message: user && user.approved 
        ? 'Email verified and account approved successfully' 
        : 'Email verified successfully. Please wait for admin approval.'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP
};