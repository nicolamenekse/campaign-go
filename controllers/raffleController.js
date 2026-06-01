const Raffle = require('../models/Raffle');
const User = require('../models/User');

// Create new raffle
const createRaffle = async (req, res) => {
  try {
    const {
      title,
      description,
      prize,
      totalWinners,
      drawDate
    } = req.body;

    const raffle = new Raffle({
      title,
      description,
      prize,
      totalWinners,
      drawDate: new Date(drawDate)
    });

    await raffle.save();

    res.status(201).json({
      message: 'Çekiliş başarıyla oluşturuldu',
      raffle
    });
  } catch (error) {
    res.status(500).json({ message: 'Çekiliş oluşturma hatası', error: error.message });
  }
};

// Get all raffles
const getAllRaffles = async (req, res) => {
  try {
    const raffles = await Raffle.find({ isActive: true })
      .sort({ drawDate: 1 });

    res.json({ raffles });
  } catch (error) {
    res.status(500).json({ message: 'Çekilişler alınamadı', error: error.message });
  }
};

// Get raffle by ID
const getRaffleById = async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı' });
    }

    res.json({ raffle });
  } catch (error) {
    res.status(500).json({ message: 'Çekiliş alınamadı', error: error.message });
  }
};

// Add participant to raffle
const addParticipant = async (req, res) => {
  try {
    const { raffleId } = req.params;
    const userId = req.user.userId;

    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı' });
    }

    if (!raffle.isActive) {
      return res.status(400).json({ message: 'Çekiliş artık aktif değil' });
    }

    if (raffle.isDrawn) {
      return res.status(400).json({ message: 'Çekiliş zaten yapıldı' });
    }

    // Check if user is already a participant
    const isParticipant = raffle.participants.some(p => p.user.toString() === userId);
    if (isParticipant) {
      return res.status(400).json({ message: 'Zaten bu çekilişe katıldınız' });
    }

    // Add user to participants
    raffle.participants.push({ user: userId });
    await raffle.save();

    res.json({ message: 'Çekilişe başarıyla katıldınız', raffle });
  } catch (error) {
    res.status(500).json({ message: 'Katılım hatası', error: error.message });
  }
};

// Draw winners for raffle
const drawWinners = async (req, res) => {
  try {
    const { raffleId } = req.params;

    const raffle = await Raffle.findById(raffleId);
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı' });
    }

    if (raffle.isDrawn) {
      return res.status(400).json({ message: 'Çekiliş zaten yapıldı' });
    }

    if (raffle.participants.length === 0) {
      return res.status(400).json({ message: 'Katılımcı yok' });
    }

    // Randomly select winners
    const shuffled = [...raffle.participants].sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(raffle.totalWinners, shuffled.length));

    // Update raffle with winners
    raffle.winners = winners.map(w => ({ user: w.user }));
    raffle.isDrawn = true;
    await raffle.save();

    res.json({
      message: 'Kazananlar başarıyla seçildi',
      winners: raffle.winners
    });
  } catch (error) {
    res.status(500).json({ message: 'Kazanan seçme hatası', error: error.message });
  }
};

// Update raffle
const updateRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı' });
    }

    res.json({
      message: 'Çekiliş başarıyla güncellendi',
      raffle
    });
  } catch (error) {
    res.status(500).json({ message: 'Çekiliş güncelleme hatası', error: error.message });
  }
};

// Delete raffle
const deleteRaffle = async (req, res) => {
  try {
    const raffle = await Raffle.findByIdAndDelete(req.params.id);
    if (!raffle) {
      return res.status(404).json({ message: 'Çekiliş bulunamadı' });
    }

    res.json({ message: 'Çekiliş başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Çekiliş silme hatası', error: error.message });
  }
};

module.exports = {
  createRaffle,
  getAllRaffles,
  getRaffleById,
  addParticipant,
  drawWinners,
  updateRaffle,
  deleteRaffle
};
