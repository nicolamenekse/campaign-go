const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const locationController = require('../controllers/locationController');
const auth = require('../middleware/auth');

// Find nearby campaigns (protected)
router.get('/nearby', auth, [
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Geçersiz enlem'),
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Geçersiz boylam')
], locationController.findNearbyCampaigns);

// Find a specific campaign (protected)
router.post('/find/:campaignId', auth, [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Geçersiz enlem'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Geçersiz boylam')
], locationController.findCampaign);

// Get user's found campaigns (protected)
router.get('/found', auth, locationController.getUserFoundCampaigns);

module.exports = router;
