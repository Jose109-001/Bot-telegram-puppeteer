// env
require("dotenv").config();
const path = require("path");

// Packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

// Utils & controllers
const errorHandler = require('./utils/error-handler');
const GameBot = require("./utils/game-bot");
const TelegramBot = require("./utils/telegram-bot");

// Routes
const apiRoutes = require('./routes/api');
const usersRoutes = require('./routes/users');

// Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(cors());
}

app.use(session({ secret: process.env.SECRET_TOKEN }));

const auth = (req, res, next) => {
  if (req.session.auth) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// User login endpoints
app.use('/api', auth, apiRoutes);
app.use('/users', usersRoutes);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  console.log("Production");
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Init app
app.listen(port, () => {
  TelegramBot.init(GameBot);
});
