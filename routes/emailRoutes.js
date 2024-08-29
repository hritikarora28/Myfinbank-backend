// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmailNotification, notifyAdminsForZeroBalance, getUserNotifications } = require('../controllers/emailController');

// Route to fetch notifications for a specific user
router.get('/:userId', getUserNotifications);

// Route to notify admins if any user has a zero balance
router.get('/notify-admins', notifyAdminsForZeroBalance);

// Other routes
router.post('/send', sendEmailNotification);

module.exports = router;
