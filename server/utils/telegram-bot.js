const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;

module.exports = {
    init (GameBot) {
        this.GameBot = GameBot;
        this.bot = new TelegramBot(token, { polling: true });
        this.bindCommands();
    },

    bindCommands () {
        const { bot } = this;

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

    commands: {
        async init(msg) {
            console.log(this);
            const { GameBot, bot } = this;
            bot.sendMessage(msg.chat.id, 'Initializing bot..');
            await GameBot.init(process.env.EMAIL, process.env.PASSWORD);
            bot.sendMessage(msg.chat.id, 'Bot initialized');
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

