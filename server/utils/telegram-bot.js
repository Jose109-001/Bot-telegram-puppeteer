const TelegramBotAPI = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;

const TelegramBot = {
    init (GameBot) {
        this.GameBot = GameBot;
        this.bot = new TelegramBotAPI(token, { polling: true });
        this.bindCommands();
    },

    sendMessage (msg) {
        if (!this.chatId) return;
        this.bot.sendMessage(this.chatId, msg);
    },

    sendPhoto (path) {
        console.log('path', path)
        if (!this.chatId) return;
        this.bot.sendPhoto(this.chatId, path);
    },

    bindCommands () {
        const { bot } = this;

        bot.on('message', this.loginValidation.bind(this));
        bot.onText(/\/init/, this.commands.init.bind(this));
        bot.onText(/\/state/, this.commands.state.bind(this));
        bot.onText(/\/data/, this.ifInitialized(this.commands.data.bind(this)));
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

    async loginValidation (msg) {
        // Only if waitingForLoginValidation and message is a number
        if (this.GameBot.waitingForLoginValidation && !isNaN(msg.text)) {
            await this.GameBot.passLoginValidation(msg.text)
        }
    },

    commands: {
        async init(msg) {
            const { GameBot, bot } = this;
            
            // Save chat id
            this.chatId = msg.chat.id;

            bot.sendMessage(msg.chat.id, 'Initializing bot..');
            await GameBot.init(process.env.EMAIL, process.env.PASSWORD, TelegramBot);
        },

        async state (msg) {
            const { GameBot, bot } = this;
            bot.sendMessage(msg.chat.id, `State: ${GameBot.state}`);
        },

        async data (msg) {
            const { GameBot, bot } = this;
            const data = await GameBot.getData();
            bot.sendMessage(msg.chat.id, JSON.stringify(data, null, 4));
        },

        async screenshot (msg) {
            const { GameBot, bot } = this;
            const screenshotPath = await GameBot.screenshot();
            console.log('screenshotPath', screenshotPath);
            bot.sendPhoto(msg.chat.id, screenshotPath);
        }
    }
};

module.exports = TelegramBot;