const express = require("express");
const router = express.Router();

const messageController = require('../controllers/messageController');

router.post('/messages', messageController.getAll);
router.post('/messages/contact', messageController.getContactMessages);

module.exports = router;