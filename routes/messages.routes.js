const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messages.controller');

router.get('/:chatId', messagesCtrl.getMessagesFromChat);

module.exports = router;
