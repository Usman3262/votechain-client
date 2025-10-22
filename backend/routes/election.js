const express = require('express');
const { 
  createElection, 
  getElections, 
  getElection,
  startElection,
  endElection,
  getElectionCounts
} = require('../controllers/electionController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Create election
// @route   POST /api/election
// @access  Private/Admin
router.post('/', protect, admin, createElection);

// @desc    Get all elections
// @route   GET /api/election
// @access  Public
router.get('/', getElections);

// @desc    Get single election
// @route   GET /api/election/:id
// @access  Public
router.get('/:id', getElection);

// @desc    Start election
// @route   PUT /api/election/start/:id
// @access  Private/Admin
router.put('/start/:id', protect, admin, startElection);

// @desc    End election
// @route   PUT /api/election/end/:id
// @access  Private/Admin
router.put('/end/:id', protect, admin, endElection);

// @desc    Get election vote counts
// @route   GET /api/election/:id/counts
// @access  Public
router.get('/:id/counts', getElectionCounts);

module.exports = router;