const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, ChatController.handleChat);

module.exports = router;
