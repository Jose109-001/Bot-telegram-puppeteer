// env
require("dotenv").config();
const path = require("path");

// Packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Utils & controllers
const GameBot = require("./utils/game-bot");
const TelegramBot = require("./utils/telegram-bot");
const botController = require("./controllers/bot-controller");

// Express
const app = express();
const port = process.env.PORT || 3001;

TelegramBot.init(GameBot);
