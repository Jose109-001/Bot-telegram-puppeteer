const puppeteer = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const wait = async (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const Bot = {
  state: 'iddle',
  config: {
    headless: true,
    defaultViewport: null,
    args: ["--start-maximized", '--window-size=1920,1080', '--no-sandbox'],
  },

  async init (username, password) {
    // Open browser
    const browser = await puppeteer.launch(this.config);

    // Get tab and go to login page
    const [page] = await browser.pages();
    await page.goto("https://lobby.ikariam.gameforge.com/en_GB");

    // Wait for login form and click on login tab
    await page.waitForSelector("#registerForm");
    await page.click(".tabsList li");

    // Complete user and password
    await page.type("[name=email]", username);
    await page.type("[name=password]", password);

    // Submit form
    await page.click("#loginForm button.button-primary");
    await page.waitForNavigation();

    console.log("Login complete");
    console.log("Waiting 1 second");

    // Wait 1 second
    await wait(1);

    console.log("Joining game");

    // Join last game
    await page.click("#joinGame .button:nth-child(2)");

    await wait(4);

    const pages = await browser.pages();
    this.page = pages[1];

    console.log('Game joined');
    
    this.state = 'initialized';
  },

  async getData () {
    return await Bot.page.evaluate(() => {
      const getValue = (resource) => document.querySelector(`#js_GlobalMenu_${resource}`).innerText;

      const wood = getValue('wood');
      const wine = getValue('wine');
      const marble = getValue('marble');
      const crystal = getValue('crystal');
      const sulfur = getValue('sulfur');
      const gold = getValue('gold');
      const population = getValue('population');

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

  async screenshot () {
    const path = __dirname + '/screenshots/screenshot.png';
    await this.page.screenshot({ path });
    return path;
  }
};

module.exports = Bot;
