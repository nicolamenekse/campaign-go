const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  prize: {
    type: String,
    required: true
  },
  totalWinners: {
    type: Number,
    required: true,
    default: 1
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    entryDate: {
      type: Date,
      default: Date.now
    }
  }],
  winners: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    wonDate: {
      type: Date,
      default: Date.now
    }
  }],
  drawDate: {
    type: Date,
    required: true
  },
  isDrawn: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Raffle', raffleSchema);
