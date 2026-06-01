const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const campaignController = require('../controllers/campaignController');
const auth = require('../middleware/auth');

// Create campaign (protected)
router.post('/', auth, [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Kampanya başlığı gerekli'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Kampanya açıklaması gerekli'),
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('İşletme adı gerekli'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Geçersiz enlem'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Geçersiz boylam'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Adres gerekli'),
  body('reward')
    .trim()
    .notEmpty()
    .withMessage('Ödül gerekli')
], campaignController.createCampaign);

// Get all campaigns
router.get('/', campaignController.getAllCampaigns);

// Get campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Update campaign (protected)
router.put('/:id', auth, campaignController.updateCampaign);

// Delete campaign (protected)
router.delete('/:id', auth, campaignController.deleteCampaign);

module.exports = router;
