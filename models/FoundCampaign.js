const mongoose = require('mongoose');

const foundCampaignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  foundAt: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  pointsEarned: {
    type: Number,
    default: 10
  }
});

// Compound index to prevent duplicate finds
foundCampaignSchema.index({ user: 1, campaign: 1 }, { unique: true });

module.exports = mongoose.model('FoundCampaign', foundCampaignSchema);
