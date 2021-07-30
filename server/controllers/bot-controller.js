const GameBot = require("../utils/game-bot");
const TelegramBot = require('../utils/telegram-bot');

const init = async (req, res) => {
  if (!TelegramBot.chatId) {
    return res.json({
      success: false,
      message: 'missing chatId'
    });
  }

  const { username, password } = req.body;
  const state = await GameBot.init(username, password, TelegramBot);
  res.json({
    success: true,
    state
  });
};

const state = async (req, res) => {
  const { state } = GameBot;
  
  res.json({
    state
  });
};

const getData = async (req, res) => {
  if (GameBot.state !== 'initialized') {
    return res.json({
      error: 'Bot is not initialized'
    });
  }

  const data =  await GameBot.getData();

  res.json(data);
};

const screenshot = async (req, res) => {
  const screenshotPath = await GameBot.screenshot();
  res.sendFile(screenshotPath);
};

module.exports = {
    init,
    state,
    getData,
    screenshot
};