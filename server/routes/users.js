const express = require('express');
const router = express.Router();
const userService = require('../services/users.service');

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => {
            if (user) {
                req.session.auth = true;
                console.log('req.session.auth', req.session.auth);
                res.json(user);
            } else {
                res.status(400).json({ error: true, message: 'Username or password is incorrect' });
            }
        })
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function isLoggedIn(req, res) {
    const auth = req.session.auth || false;
    res.json({ auth });
}

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/isLoggedIn', isLoggedIn);

module.exports = router;
