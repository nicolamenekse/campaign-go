const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const raffleController = require('../controllers/raffleController');
const auth = require('../middleware/auth');

// Create raffle (protected)
router.post('/', auth, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Çekiliş başlığı gerekli'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Çekiliş açıklaması gerekli'),
  body('prize')
    .trim()
    .notEmpty()
    .withMessage('Ödül gerekli'),
  body('totalWinners')
    .isInt({ min: 1 })
    .withMessage('Kazanan sayısı en az 1 olmalı'),
  body('drawDate')
    .isISO8601()
    .withMessage('Geçersiz tarih formatı')
], raffleController.createRaffle);

// Get all raffles
router.get('/', raffleController.getAllRaffles);

// Get raffle by ID
router.get('/:id', raffleController.getRaffleById);

// Add participant to raffle (protected)
router.post('/:raffleId/participate', auth, raffleController.addParticipant);

// Draw winners (protected)
router.post('/:raffleId/draw', auth, raffleController.drawWinners);

// Update raffle (protected)
router.put('/:id', auth, raffleController.updateRaffle);

// Delete raffle (protected)
router.delete('/:id', auth, raffleController.deleteRaffle);

module.exports = router;
