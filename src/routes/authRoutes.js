const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Rutas protegidas (requieren autenticación)
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
