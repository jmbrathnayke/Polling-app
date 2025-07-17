const express = require('express');
const {
  register,
  login,
  resetPassword,
  confirmResetPassword,
  updateProfile,
  getMe,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.put('/reset-password/:token', confirmResetPassword);

// Protected routes
router.put('/update-profile', authMiddleware, updateProfile);
router.get('/me', authMiddleware, getMe);

module.exports = router;
