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

  async init(username, password) {
    if (this.state !== "iddle") return console.log("Bot already started");

    // Open browser
    const browser = await this.getBrowser();

    // Get page
    const page = await this.getPage();

    // Go to login page
    await page.goto("https://lobby.ikariam.gameforge.com/en_GB");

    // Wait for login form and click on login tab
    await page.waitForSelector("#registerForm");
    await page.click(".tabsList li");

    // Complete user and password
    await page.type("[name=email]", username);
    await page.type("[name=password]", password);

    // Submit form
    await page.click("#loginForm button.button-primary");

    // Wait 2 seconds until checking for validation iframe
    await wait(2);

    // If game asks for a login validation, an iframe shows up
    const joinGame = await page.evaluate(() => Boolean(document.querySelector("#joinGame")));

    let response;

    if (!joinGame) {
      response = await this.initLoginValidation();
    } else {
      response = await this.loginComplete();
    }

    return {
      state: this.state,
      ...(response || {}),
    };
  },

  setOnLoginValidation(fn) {
    this.onLoginValidation = fn;
  },

  async initLoginValidation() {
    this.state = "validating-login";
    
    // Send screenshot of validation
    const clip = {
      x: 790,
      y: 260,
      width: 335,
      height: 560,
    };

    // Get screenshot path
    const screenshotPath = path.join(
      __dirname,
      "/screenshots/login-validation.png"
    );

    // Wait 2 seconds and take a screenshot and save it
    await wait(3);
    await this.page.screenshot({
      clip,
      path: screenshotPath,
    });

    // Change validation state to true
    this.waitingForLoginValidation = true;

    return {
      screenshotPath,
    };
  },

  async passLoginValidation(boxNumber) {
    this.waitingForLoginValidation = false;
    await this.page.evaluate(dragAndDrop, boxNumber - 1);
    await wait(5);
    return await this.loginComplete();
  },

  async loginComplete() {
    this.state = "initialized";

    try {
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

      this.closePopUps();

      console.log("Game joined");
    } catch (e) {
      console.log("Error happened at loginComplete", e);
      return await this.loginComplete();
    }
  },

  async closePopUps() {
    await wait(4);

    // Close all popups
    await this.page.evaluate(() => {
      if (typeof ikariam === "undefined") return;
      ikariam.getMultiPopupController().closePopup();
    });
  },

  async getData() {
    return await this.page.evaluate(() => {
      const getValue = (resource) =>
        document.querySelector(`#js_GlobalMenu_${resource}`)?.innerText;

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

  async stop() {
    await this.browser.close();
    this.browser = null;
    this.page = null;
    this.state = "iddle";
  },
  
  async pause() {
    await this.page.close();
    await this.getPage();
    this.state = "iddle";
  },

  async restart(user, password, telegramBot) {
    await this.stop();
    await this.init(user, password, telegramBot);
  },

  async attack(attackLevel = 1) {
    const levels = [2.5, 7.5, 15, 30];
    const { page } = this;
    await page.click("#js_CityPosition17Link");
    await wait(3);
    await page.click(
      `#pirateCaptureBox tr:nth-child(${attackLevel}) .action a`
    );

    return {
      returnTime: levels[attackLevel - 1],
    };
  },

  async screenshot() {
    const path = __dirname + "/screenshots/screenshot.png";
    await this.page.screenshot({ path });
    return path;
  },
};

module.exports = Bot;
