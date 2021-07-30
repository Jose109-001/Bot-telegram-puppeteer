const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const dragAndDrop = require("./dragAndDrop");
const path = require("path");

puppeteer.use(StealthPlugin());

const wait = async (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const Bot = {
  state: "iddle",
  config: {
    browser: {
      headless: true,
      defaultViewport: null,
      args: ["--start-maximized", "--window-size=1920,1080", "--no-sandbox"],
    },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
  },

  async getBrowser() {
    this.browser = await puppeteer.launch(this.config.browser);
    return this.browser;
  },

  async getPage() {
    // Get tab/page
    const pages = await this.browser.pages();
    this.page = pages[pages.length - 1];
    await this.page.setUserAgent(this.config.userAgent);
    return this.page;
  },

  async init(username, password, TelegramBot) {
    // TelegramBot, browser and page saved in this instance
    this.TelegramBot = TelegramBot;

    // Open browser
    const browser = await this.getBrowser();

    // Get page
    const page = await this.getPage();

    // Go to login page
    await page.goto("https://lobby.ikariam.gameforge.com/en_GB");

    // Bot state change to initialized
    this.state = "initialized";

    // Wait for login form and click on login tab
    await page.waitForSelector("#registerForm");
    await page.click(".tabsList li");

    // Complete user and password
    await page.type("[name=email]", username);
    await page.type("[name=password]", password);

    // Submit form
    await page.click("#loginForm button.button-primary");

    // Wait 3 seconds until checking for validation iframe
    await wait(3);

    // If game asks for a login validation, an iframe shows up
    const iframe = await page.evaluate(() => document.querySelector("iframe"));

    if (iframe) {
      await this.initLoginValidation();
    } else {
      await this.loginComplete();
    }
  },

  async initLoginValidation() {
    const { TelegramBot } = this;

    // Send messages to telegram
    TelegramBot.sendMessage("Waiting for login validation...");

    await wait(2);

    TelegramBot.sendMessage("Pick the box number to move (1 to 4)");

    // Send screenshot of validation
    const clip = {
      x: 790,
      y: 260,
      width: 335,
      height: 560,
    };
    const screenshotPath = path.join(
      __dirname,
      "/screenshots/login-validation.png"
    );
    const screenshot = await this.page.screenshot({
      clip,
      path: screenshotPath,
    });

    TelegramBot.sendPhoto(screenshotPath);

    // Change validation state to tru
    this.waitingForLoginValidation = true;
  },

  async passLoginValidation(boxNumber) {
    this.waitingForLoginValidation = false;
    await this.page.evaluate(dragAndDrop, boxNumber - 1);
    await wait(3);
    await this.loginComplete();
  },

  async loginComplete() {
    // Log messages
    console.log("Login complete");
    console.log("Waiting 1 second");

    // Join last game
    await this.page.waitForSelector("#joinGame .button:nth-child(2)");
    await this.page.click("#joinGame .button:nth-child(2)");

    console.log("Joining game");

    // Wait for navigation and get new page
    await wait(4);
    await this.getPage();

    console.log("Game joined");

    const url =
      process.env.NODE_ENV === "production"
        ? process.env.HEROKU_URL
        : "http://localhost:3001/";

    // Send message to telegram
    this.TelegramBot.sendMessage("Bot initialized");
    this.TelegramBot.sendMessage(`You can visit the admin at ${url}`);

    await wait(4);

    // Close all popups
    await this.page.evaluate(() => {
      ikariam.getMultiPopupController().closePopup();
    });
  },

  async getData() {
    return await this.page.evaluate(() => {
      const getValue = (resource) =>
        document.querySelector(`#js_GlobalMenu_${resource}`).innerText;

      const wood = getValue("wood");
      const wine = getValue("wine");
      const marble = getValue("marble");
      const crystal = getValue("crystal");
      const sulfur = getValue("sulfur");
      const gold = getValue("gold");
      const population = getValue("population");

      return {
        population,
        gold,
        wood,
        wine,
        marble,
        crystal,
        sulfur,
      };
    });
  },

  async screenshot() {
    const path = __dirname + "/screenshots/screenshot.png";
    await this.page.screenshot({ path });
    return path;
  },
};

module.exports = Bot;
