const Vote = require('../models/Vote');
const Election = require('../models/Election');
const blockchainService = require('../services/blockchainService');
const crypto = require('crypto');

// @desc    Submit vote via relayer
// @route   POST /api/vote/submit
// @access  Private (authenticated user)
const submitVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;

    // Validate required fields
    if (!electionId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: electionId, candidateId'
      });
    }

    // Check if election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    if (!election.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Election is not active'
      });
    }

    // Check if user has already voted in this election
    // We'll use a hash of user ID + election ID to prevent double voting
    const voteIdentifier = crypto
      .createHash('sha256')
      .update(`${req.user.id}-${electionId}`)
      .digest('hex');

    const existingVote = await Vote.findOne({ 
      electionId, 
      voterHash: voteIdentifier 
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'User has already voted in this election'
      });
    }

    // Verify candidateId is valid for this election
    const candidate = election.candidates.find(c => c.id === candidateId);
    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid candidate for this election'
      });
    }

    // Submit the vote to the blockchain via relayer
    // Create a unique identifier for this vote for privacy
    const nullifierHash = '0x' + crypto
      .createHash('keccak256')
      .update(`${req.user.id}-${electionId}-${candidateId}-${Date.now()}`)
      .digest('hex');

    const txHash = await blockchainService.submitVote(
      candidateId,
      nullifierHash,
      req.user
    );

    // Store audit record with anonymized voter identifier
    const vote = await Vote.create({
      electionId,
      candidateId,
      voterHash: voteIdentifier, // Hash of user ID + election ID for double voting prevention
      txHash,
      userId: req.user.id // Store for admin audit purposes only
    });

    // Return success response
    res.json({
      success: true,
      message: 'Vote submitted successfully',
      txHash,
      candidateId
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing vote'
    });
  }
};

// @desc    Verify vote eligibility (for testing purposes)
// @route   POST /api/vote/verify
// @access  Private
const verifySignature = async (req, res) => {
  try {
    const { electionId } = req.body;

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: 'Election ID is required'
      });
    }

    // Check if user has already voted in this election
    const voteIdentifier = crypto
      .createHash('sha256')
      .update(`${req.user.id}-${electionId}`)
      .digest('hex');

    const existingVote = await Vote.findOne({ 
      electionId, 
      voterHash: voteIdentifier 
    });

    const canVote = !existingVote;

    res.json({
      success: true,
      canVote,
      message: canVote ? 'User can vote in this election' : 'User has already voted in this election'
    });
  } catch (error) {
    console.error('Vote eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking vote eligibility'
    });
  }
};

module.exports = {
  submitVote,
  verifySignature
};