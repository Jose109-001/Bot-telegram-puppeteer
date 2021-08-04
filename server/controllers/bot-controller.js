const GameBot = require("../utils/game-bot");
const path = require("path");

// Init game
const init = async (req, res) => {
  const { username, password } = req.body;
  const { state, ...data } = await GameBot.init(username, password);

  console.log({ state, ...data })

  res.json({
    success: true,
    state,
  });
};

const getLoginScreenshot = (req, res) => {
  res.sendFile(path.join(
    __dirname,
    "../utils/screenshots/login-validation.png"
  ));
};

// Get current game state
const state = async (req, res) => {
  const { state } = GameBot;

  res.json({
    state,
  });
};

// Get resources
const getData = async (req, res) => {
  if (GameBot.state !== "initialized") {
    return res.json({
      error: "Bot is not initialized",
    });
  }

  const data = await GameBot.getData();

  res.json(data);
};

// Screenshot
const screenshot = async (req, res) => {
  const screenshotPath = await GameBot.screenshot();
  res.sendFile(screenshotPath);
};

// Attack
const attack = async (req, res) => {
  await GameBot.attack();
  res.json({ success: true });
};

// Validate login
const validateLogin = async (req, res) => {
  const { box } = req.body;

  if (GameBot.waitingForLoginValidation) {
    await GameBot.passLoginValidation(box);
    res.json({
      success: true,
      state: GameBot.state,
    });
  } else {
    res.json({
      success: false,
    });
  }
};

module.exports = {
  init,
  state,
  attack,
  getData,
  screenshot,
  validateLogin,
  getLoginScreenshot
};
