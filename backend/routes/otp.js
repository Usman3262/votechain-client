const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/otpController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/otp/send
router.route('/send').post(sendOTP);

// @route   POST /api/otp/verify
router.route('/verify').post(verifyOTP);

module.exports = router;