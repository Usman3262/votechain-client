const User = require('../models/User');
const Election = require('../models/Election');
const { sendApprovalEmail } = require('../utils/emailService');

// @desc    Get pending users
// @route   GET /api/admin/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false }).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        cnic: user.cnic,
        mobileNumber: user.mobileNumber,
        age: user.age,
        isSuperiorEmail: user.isSuperiorEmail,
        verified: user.verified,
        approved: user.approved,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching pending users' 
    });
  }
};

// @desc    Approve user
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.approved = true;
    await user.save();

    // Send approval notification email
    try {
      await sendApprovalEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Continue with response even if email fails
    }

    res.json({
      success: true,
      message: 'User approved successfully',
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
    console.error('Approve user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while approving user' 
    });
  }
};

// @desc    Reject user
// @route   PUT /api/admin/reject/:id
// @access  Private/Admin
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // For now, we just set approved to false (in real app you might want to delete or handle differently)
    user.approved = false;
    await user.save();

    res.json({
      success: true,
      message: 'User rejected successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while rejecting user' 
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        cnic: user.cnic,
        mobileNumber: user.mobileNumber,
        age: user.age,
        isSuperiorEmail: user.isSuperiorEmail,
        verified: user.verified,
        approved: user.approved,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }))
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching users' 
    });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllUsers
};