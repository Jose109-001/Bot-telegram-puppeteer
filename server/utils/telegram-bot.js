const TelegramBotAPI = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;

const TelegramBot = {
    user: {
        username: process.env.EMAIL,
        password: process.env.PASSWORD
    },

    options: {
        parse_mode: 'HTML',
        disable_web_page_preview: true
    },

    init (GameBot) {
        this.GameBot = GameBot;
        this.bot = this.getBot();
        this.bindCommands();
    },

    getBot() {
        const production = process.env.NODE_ENV === 'production';
        const config = !production ? { polling: true } : undefined;
        const bot = new TelegramBotAPI(token, config);

        // Heroku puts app to sleep after a short time; this is avoided by setting a web hook
        if (production) {
            bot.setWebHook(process.env.HEROKU_URL + bot.token);
        }

        return bot;
    },

    sendMessage (msg) {
        if (!this.chatId) return;
        this.bot.sendMessage(this.chatId, msg, this.options);
    },

    sendPhoto (path) {
        if (!this.chatId) return;
        this.bot.sendPhoto(this.chatId, path);
    },

    bindCommands () {
        const { bot } = this;

        // Answers to bot questions/options
        bot.on('message', (msg) => console.log('Message received:', msg.text));
        bot.on('message', this.login.bind(this));
        bot.on('message', this.loginValidation.bind(this));
        bot.on('message', this.captcha.bind(this));

        // Initial commands
        bot.onText(/\/init/, this.ifNotInitialized(this.commands.init.bind(this)));
        bot.onText(/\/start/, this.ifNotInitialized(this.commands.init.bind(this)));
        bot.onText(/\/state/, this.commands.state.bind(this));
        bot.onText(/\/setchatid/, this.commands.setChatId.bind(this));

        // Game-ready commands
        bot.onText(/\/stop/, this.ifInitialized(this.commands.stop.bind(this)));
        bot.onText(/\/restart/, this.ifInitialized(this.commands.restart.bind(this)));
        bot.onText(/\/data/, this.ifInitialized(this.commands.data.bind(this)));
        bot.onText(/\/attack/, this.ifInitialized(this.commands.attack.bind(this)));
        bot.onText(/\/screenshot/, this.ifInitialized(this.commands.screenshot.bind(this)));
    },

    ifInitialized (next) {
        const { GameBot, bot } = this;

        return (msg) => {
            if (GameBot.state !== 'initialized') {
                return bot.sendMessage(msg.chat.id, 'Bot is not initialized!');
            }

            next(msg);
        };
    },

    ifNotInitialized (next) {
        const { GameBot, bot } = this;

        return (msg) => {
            if (GameBot.state !== 'iddle') {
                return bot.sendMessage(msg.chat.id, 'Bot is already initialized!');
            }

            next(msg);
        };
    },

    async login (msg) {
        // Receiving password
        if (this.waitingForUserPassword) {
            this.waitingForUserPassword = false;
            this.user.password = msg.text.trim();
            this.initializeBot();
        }

        // Receiving email
        if (this.waitingForUserEmail) {
            this.waitingForUserEmail = false;
            this.user.username = msg.text.trim();
            this.bot.sendMessage(msg.chat.id, 'Please, type your password');
            this.waitingForUserPassword = true;
        }
    },

    async captcha (msg) {
        const { GameBot, bot } = this;
        if (GameBot.waitingForCaptcha) {
            // ...
        }
    },
 
    async loginValidation (msg) {
        // Only if waitingForLoginValidation and message is a number
        if (this.GameBot.waitingForLoginValidation && !isNaN(msg.text)) {
            await this.GameBot.passLoginValidation(msg.text)
        }
    },

    async initializeBot () {
        this.bot.sendMessage(this.chatId, 'Initializing bot..');
        this.GameBot.init(this.user.username, this.user.password, this);
    },

    commands: {
        async setChatId(msg) {
            const url = process.env.HEROKU_URL || 'http://localhost:3001/';
            this.chatId = msg.chat.id;
            const message = `Thank you, you can go back to ${url}`;
            this.bot.sendMessage(this.chatId, message, this.options);
        },

        async init(msg) {
            const { GameBot, bot, user: { username, password } } = this;
            
            // Save chat id
            this.chatId = msg.chat.id;

            if (username && password) {
                this.initializeBot();
            } else {
                bot.sendMessage(this.chatId, 'Please, type your username');
                this.waitingForUserEmail = true;
            }
        },

        async stop(msg) {
            const { GameBot, bot } = this;
            await GameBot.stop();
            bot.sendMessage(msg.chat.id, 'Bot stopped')
        },

        async restart(msg) {
            const { GameBot, bot } = this;
            bot.sendMessage(msg.chat.id, 'Restarting bot');
            await GameBot.restart(this.user.username, this.user.password, this);
            bot.sendMessage(msg.chat.id, 'Bot restarted');
        },

        async state (msg) {
            const { GameBot, bot } = this;
            bot.sendMessage(msg.chat.id, `State: ${GameBot.state}`);
        },

        async data (msg) {
            const { GameBot, bot } = this;
            const data = await GameBot.getData();
            const parsedData = Object.entries(data).map(([item, value]) => {
                item = item[0].toUpperCase() + item.slice(1);
                return `<b>${item}:</b> ${value}`;
            }).join('\n');
            const message = `<b>Resources</b>\n------------------\n${parsedData}`;
            bot.sendMessage(msg.chat.id, message, this.options);
        },

        async screenshot (msg) {
            const { GameBot, bot } = this;
            bot.sendMessage(msg.chat.id, 'Sending screenshot, this may take a few seconds...');
            const screenshotPath = await GameBot.screenshot();
            bot.sendPhoto(msg.chat.id, screenshotPath);
        },

        async attack (msg) {
            const { GameBot, bot } = this;

            // Send attack and 2 messages for the user
            bot.sendMessage(msg.chat.id, 'Sending attack');
            const attackInfo = await GameBot.attack();
            bot.sendMessage(msg.chat.id, 'Attack sent');
            
            console.log('attackInfo.returnTime', attackInfo.returnTime)
            // Sends a message when attack finished
            setTimeout(() => {
                bot.sendMessage(msg.chat.id, 'Attack has finished');
            }, attackInfo.returnTime * 60 * 1000);
        }
    }
};

module.exports = TelegramBot;