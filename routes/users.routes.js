const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');

router.get('/', userCtrl.getUsers);
router.post('/contacts', userCtrl.addContact);
router.delete('/contacts/:userId', userCtrl.deleteContact);

module.exports = router;
