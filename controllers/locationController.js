const Campaign = require('../models/Campaign');
const FoundCampaign = require('../models/FoundCampaign');
const User = require('../models/User');

// Find campaigns near user's location
const findNearbyCampaigns = async (req, res) => {
  try {
    const { latitude, longitude, radius = 1000 } = req.query; // radius in meters

    const campaigns = await Campaign.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    }).populate('raffle');

    res.json({ campaigns, count: campaigns.length });
  } catch (error) {
    res.status(500).json({ message: 'Yakındaki kampanyalar bulunamadı', error: error.message });
  }
};

// Find a specific campaign (when user arrives at location)
const findCampaign = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { latitude, longitude } = req.body;
    const userId = req.user.userId;

    // Check if campaign exists and is active
    const campaign = await Campaign.findById(campaignId).populate('raffle');
    if (!campaign || !campaign.isActive) {
      return res.status(404).json({ message: 'Kampanya bulunamadı veya aktif değil' });
    }

    // Check if user already found this campaign
    const alreadyFound = await FoundCampaign.findOne({
      user: userId,
      campaign: campaignId
    });

    if (alreadyFound) {
      return res.status(400).json({ message: 'Bu kampanyayı zaten buldunuz' });
    }

    // Check if user is within range (50 meters)
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      campaign.location.coordinates[1],
      campaign.location.coordinates[0]
    );

    if (distance > 50) {
      return res.status(400).json({ message: 'Konuma yeterince yakınsınız değil' });
    }

    // Record the found campaign
    const foundCampaign = new FoundCampaign({
      user: userId,
      campaign: campaignId,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      pointsEarned: 10
    });

    await foundCampaign.save();

    // Update user's score and found campaigns
    await User.findByIdAndUpdate(userId, {
      $inc: { score: 10 },
      $push: { foundCampaigns: campaignId }
    });

    // Update campaign's total finds
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { totalFinds: 1 }
    });

    // If campaign has a raffle, add user to participants
    if (campaign.raffle) {
      await User.findByIdAndUpdate(userId, {
        $push: { raffleEntries: campaign.raffle._id }
      });
    }

    res.json({
      message: 'Tebrikler! Kampanyayı buldunuz',
      campaign,
      pointsEarned: 10,
      enteredRaffle: !!campaign.raffle
    });
  } catch (error) {
    res.status(500).json({ message: 'Kampanya bulma hatası', error: error.message });
  }
};

// Get campaigns found by user
const getUserFoundCampaigns = async (req, res) => {
  try {
    const userId = req.user.userId;

    const foundCampaigns = await FoundCampaign.find({ user: userId })
      .populate('campaign')
      .sort({ foundAt: -1 });

    res.json({ foundCampaigns });
  } catch (error) {
    res.status(500).json({ message: 'Bulunan kampanyalar alınamadı', error: error.message });
  }
};

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

module.exports = {
  findNearbyCampaigns,
  findCampaign,
  getUserFoundCampaigns
};
