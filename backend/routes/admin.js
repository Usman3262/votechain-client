const express = require('express');
const { 
  getPendingUsers, 
  approveUser, 
  rejectUser, 
  getAllUsers 
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get pending users
// @route   GET /api/admin/pending
// @access  Private/Admin
router.get('/pending', protect, admin, getPendingUsers);

// @desc    Approve user
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
router.put('/approve/:id', protect, admin, approveUser);

// @desc    Reject user
// @route   PUT /api/admin/reject/:id
// @access  Private/Admin
router.put('/reject/:id', protect, admin, rejectUser);

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, getAllUsers);

module.exports = router;