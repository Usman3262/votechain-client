const Election = require('../models/Election');
const User = require('../models/User');
const blockchainService = require('../services/blockchainService');
const { sendElectionNotification } = require('../utils/emailService');

// @desc    Create election
// @route   POST /api/election
// @access  Private/Admin
const createElection = async (req, res) => {
  try {
    const { title, description, startTime, endTime, candidates } = req.body;

    // Validate candidates
    if (!candidates || !Array.isArray(candidates) || candidates.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 candidates are required'
      });
    }

    // Create election in database with placeholder blockchainElectionId
    const election = await Election.create({
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      candidates: candidates.map((name, index) => ({
        id: index + 1, // Sequential IDs starting from 1
        name
      })),
      createdBy: req.user._id
    });

    try {
      // Create election on blockchain and get the blockchain election ID
      const blockchainElectionId = await blockchainService.createElection(
        title,
        Math.floor(new Date(startTime).getTime() / 1000), // Convert to Unix timestamp
        Math.floor(new Date(endTime).getTime() / 1000)     // Convert to Unix timestamp
      );

      // Add candidates to blockchain contract sequentially to avoid nonce conflicts
      for (let i = 0; i < candidates.length; i++) {
        await blockchainService.addCandidate(blockchainElectionId, candidates[i]);
      }

      // Update the election in database with the actual blockchain election ID
      election.blockchainElectionId = blockchainElectionId;
      await election.save();

      // Send notification emails to all approved users
      try {
        const users = await User.find({ approved: true });
        for (const user of users) {
          await sendElectionNotification(user.email, user.name, election.title, election._id);
        }
      } catch (notificationError) {
        console.error('Error sending election notifications:', notificationError);
        // Don't throw error as the election creation should still succeed
      }
    } catch (blockchainError) {
      // If blockchain operations fail, clean up the database entry
      await Election.findByIdAndDelete(election._id);
      throw blockchainError;
    }

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      election
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating election'
    });
  }
};

// @desc    Get all elections
// @route   GET /api/election
// @access  Public
const getElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: elections.length,
      elections
    });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching elections'
    });
  }
};

// @desc    Get single election
// @route   GET /api/election/:id
// @access  Public
const getElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    res.json({
      success: true,
      election
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching election'
    });
  }
};

// @desc    Start election
// @route   PUT /api/election/start/:id
// @access  Private/Admin
const startElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Call blockchain service to start election
    await blockchainService.startElection(election.blockchainElectionId || election._id.toString());

    election.isActive = true;
    await election.save();

    res.json({
      success: true,
      message: 'Election started successfully',
      election
    });
  } catch (error) {
    console.error('Start election error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting election'
    });
  }
};

// @desc    End election
// @route   PUT /api/election/end/:id
// @access  Private/Admin
const endElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Call blockchain service to end election
    await blockchainService.endElection(election.blockchainElectionId || election._id.toString());

    election.isActive = false;
    await election.save();

    res.json({
      success: true,
      message: 'Election ended successfully',
      election
    });
  } catch (error) {
    console.error('End election error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending election'
    });
  }
};

// @desc    Get election vote counts from blockchain
// @route   GET /api/election/:id/counts
// @access  Public
const getElectionCounts = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: 'Election not found'
      });
    }

    // Get vote counts from blockchain
    const counts = await blockchainService.getElectionCounts(election.blockchainElectionId || election._id.toString());

    // Combine with candidate information
    const result = election.candidates.map((candidate, index) => ({
      id: candidate.id,
      name: candidate.name,
      votes: counts[index] || 0
    }));

    res.json({
      success: true,
      electionId: election._id,
      candidates: result
    });
  } catch (error) {
    console.error('Get election counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching election counts'
    });
  }
};

module.exports = {
  createElection,
  getElections,
  getElection,
  startElection,
  endElection,
  getElectionCounts
};