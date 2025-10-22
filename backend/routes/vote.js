const express = require('express');
const { submitVote, verifySignature } = require('../controllers/relayerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit vote via relayer (privacy-preserving)
// @route   POST /api/vote/submit
// @access  Private (authenticated user)
router.post('/submit', protect, submitVote);

// @desc    Verify signature (for testing)
// @route   POST /api/vote/verify
// @access  Private
router.post('/verify', protect, verifySignature);

module.exports = router;