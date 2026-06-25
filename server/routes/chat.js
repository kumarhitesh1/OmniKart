const express = require("express");
const { chatWithAI } = require("../controller/chat");
const router = express.Router();

router.post("/chat", chatWithAI);

module.exports = router;