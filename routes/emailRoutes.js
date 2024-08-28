// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { sendEmailNotification } = require('../controllers/emailController');

router.post('/send', sendEmailNotification);

module.exports = router;
