const express = require('express');
const router = express.Router();
const chatUserController = require('../controllers/chatUser.controller');

router.post('/initiate', chatUserController.createChatUser);
router.get('/', chatUserController.getChatUsers);

module.exports = router;
