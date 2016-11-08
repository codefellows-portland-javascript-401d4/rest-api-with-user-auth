const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const User = require('../models/user');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensureAuth')();
const ensureRole = require('../auth/ensureRole');

router
    .post('/validate', ensureAuth, (req, res, next) => {
        res.send({valid: true});
    })

    .post('/signup', bodyParser, (req, res, next) => {
        const {username, password} = req.body;
        delete req.body.password;
        let userId = '';

        if (!username || !password) {
            return next({
                code: 400,
                error: 'username and password must be given'
            });
        };

        User
            .find({username})
            .count()
            .then(count => {
                //what if we did a next statement?
                if (count > 0) throw {code: 400, error: `username ${username} already exists!`};
                const user = new User(req.body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                userId += user._id;
                return token.sign(user);
            })
            .then(token => {
                res.send({token: token, user_id: userId});
            })
            .catch(err => {
                next(err);
            });
    })

    .post('/signin', bodyParser, (req, res, next) => {
        const {username, password} = req.body;
        delete req.body.password;

        User
            .findOne({username})
            .then(user => {
                if (!user || !user.compareHash(password)) { 
                    throw {code: 400, error: 'invalid username or password'};
                };
                return token.sign(user);
            })
            .then(token => {
                res.send({token});
            })
            .catch(err => {
                next(err);
            });
    })

    //should only work if you have admin access
    .delete('/:id', ensureAuth, ensureRole(['admin']), bodyParser, (req, res, next) => {
        User.findByIdAndRemove(req.params.id)
            .then(user => res.send(user))
            .catch(next);
    });

module.exports = router;