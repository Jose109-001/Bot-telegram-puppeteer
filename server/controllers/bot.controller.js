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

const stop = async (req, res) => {
  await GameBot.stop();
  res.json({
    success: true
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
    const success = await GameBot.passLoginValidation(box);
    res.json({
      success,
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
  stop,
  state,
  attack,
  getData,
  screenshot,
  validateLogin,
  getLoginScreenshot
};

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}