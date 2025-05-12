const express = require('express');
const router = express.Router();
const chatCtrl = require('../controllers/chat.controller');

router.get('/', chatCtrl.getChats);

module.exports = router;
