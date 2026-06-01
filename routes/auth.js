const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register validation
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Kullanıcı adı 3-30 karakter olmalıdır'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi girin'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır')
], authController.register);

// Login validation
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Geçerli bir e-posta adresi girin'),
  body('password')
    .notEmpty()
    .withMessage('Şifre gerekli')
], authController.login);

// Get current user (protected)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
