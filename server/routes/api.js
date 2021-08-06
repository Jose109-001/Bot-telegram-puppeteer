const express = require('express');
const router = express.Router();
const botController = require("../controllers/bot.controller");

// Endpoints
router.post("/init-bot", botController.init);
router.post("/validate-login", botController.validateLogin);
router.get("/stop", botController.stop);
router.get("/attack", botController.attack);
router.get("/bot-state", botController.state);
router.get("/get-data", botController.getData);
router.get("/screenshot", botController.screenshot);
router.get("/get-login-screenshot", botController.getLoginScreenshot);

module.exports = router;
