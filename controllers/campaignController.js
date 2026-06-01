const Campaign = require('../models/Campaign');
const FoundCampaign = require('../models/FoundCampaign');
const User = require('../models/User');

// Create new campaign
const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      businessName,
      latitude,
      longitude,
      address,
      reward,
      raffleId,
      difficulty,
      startDate,
      endDate
    } = req.body;

    const campaign = new Campaign({
      title,
      description,
      businessName,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude] // MongoDB stores coordinates as [longitude, latitude]
      },
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address
      },
      reward,
      raffle: raffleId,
      difficulty,
      startDate,
      endDate
    });

    await campaign.save();

    res.status(201).json({
      message: 'Kampanya başarıyla oluşturuldu',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: 'Kampanya oluşturma hatası', error: error.message });
  }
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate('raffle')
      .sort({ createdAt: -1 });

    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ message: 'Kampanyalar alınamadı', error: error.message });
  }
};

// Get campaign by ID
const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('raffle');
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }

    res.json({ campaign });
  } catch (error) {
    res.status(500).json({ message: 'Kampanya alınamadı', error: error.message });
  }
};

// Update campaign
const updateCampaign = async (req, res) => {
  try {
    const { latitude, longitude, ...updateData } = req.body;

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude],
        address: updateData.address || ''
      };
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }

    res.json({
      message: 'Kampanya başarıyla güncellendi',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: 'Kampanya güncelleme hatası', error: error.message });
  }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Kampanya bulunamadı' });
    }

    res.json({ message: 'Kampanya başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Kampanya silme hatası', error: error.message });
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
};
