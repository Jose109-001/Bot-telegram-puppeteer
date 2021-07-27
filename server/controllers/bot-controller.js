const GameBot = require("../utils/game-bot");

const init = async (req, res) => {
  const { username, password } = req.body;
  await GameBot.init(username, password);
  res.json({
    success: true
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
  console.log({ data });

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