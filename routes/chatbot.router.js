const express = require('express');
const router = express.Router();
const { askFromResume } = require('../chatBot/chatBot.controller');

router.post("/ask", askFromResume);

module.exports = router;