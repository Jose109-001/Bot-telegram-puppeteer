const mongoose = require('mongoose');
const connectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};
const url = process.env.MONGODB_URI;

mongoose.connect(url, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('./user')
};

/*2021-08-05T23:15:06.592592+00:00 app[web.1]: Message received: /restart
2021-08-05T23:15:20.917291+00:00 app[web.1]: { iframe: false }
2021-08-05T23:15:20.917778+00:00 app[web.1]: Login complete
2021-08-05T23:15:20.917891+00:00 app[web.1]: Waiting 1 second
2021-08-05T23:15:21.135682+00:00 app[web.1]: Joining game
2021-08-05T23:15:27.464086+00:00 app[web.1]: Game joined*/