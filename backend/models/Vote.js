const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidateId: {
    type: Number,
    required: true
  },
  voterHash: {
    type: String,
    required: true,
    index: true // Index for quick lookup to prevent double voting
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vote', voteSchema);