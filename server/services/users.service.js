const bcrypt = require('bcryptjs');
const { User } = require('../model/db');

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    
    if (user && bcrypt.compareSync(password, user.hash)) {
        return user.toJSON();
    }
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

module.exports = {
    authenticate,
    create
};
