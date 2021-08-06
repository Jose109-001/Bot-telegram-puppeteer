// env
require("dotenv").config();
const path = require("path");

// Packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Utils & controllers
const jwt = require('./utils/jwt');
const errorHandler = require('./utils/error-handler');
const GameBot = require("./utils/game-bot");
const TelegramBot = require("./utils/telegram-bot");
const botController = require("./controllers/bot.controller");

// Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
//app.use(jwt());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

// Endpoints
app.get("/api/attack", botController.attack);
app.post("/api/init-bot", botController.init);
app.get("/api/bot-state", botController.state);
app.get("/api/get-data", botController.getData);
app.get("/api/screenshot", botController.screenshot);
app.post("/api/validate-login", botController.validateLogin);
app.get("/api/get-login-screenshot", botController.getLoginScreenshot);

// User login endpoints
app.use('/users', require('./controllers/users.controller'));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  console.log("Production");
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Init app
app.listen(port, () => {
  TelegramBot.init(GameBot);
});
