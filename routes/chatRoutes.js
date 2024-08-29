const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/:userEmail', getMessages);

module.exports = router;
