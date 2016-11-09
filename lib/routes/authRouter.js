/** Created by Gloria Anholt on 11/7/16. **/

const router = require('express').Router();
const bodyParser = require('body-parser').json();
const User = require('../models/users');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth');


router
  .post('/signup', bodyParser, (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    // we have the pswd saved locally, take it off the req obj now
    delete req.body.password;

    if (!username || !password) {
      return next({
        code: 400,
        error: 'Username and password are required.'
      });
    }

    User.find({ username })
      .count()
      .then(count => {
        if (count > 0) {
          return next({
            code: 400,
            error: `Username ${username} already taken. Please try a different name.`
          });
        }

        const newUser = new User(req.body);
        newUser.generateHash(password);
        return newUser.save();
      })
      // newUser.save isn't returning the user model, so fetch it to make the token
      .then(() => { return User.find({username}); })
      .then(userArray => { token.sign(userArray[0]); })
      .then(token => res.send(token))
      .catch(next);
  })

  .post('/signin', bodyParser, (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;
    delete req.body.password;

    if (!username || !password) {
      return next({
        code: 400,
        error: 'Username and password are required.'
      });
    }

    User.find({ username })                   // try to find the user
      .then( user => {
        if (!user.validateHash(password)) {   // check the pswd against the stored pswd
          return next({
            code: 401,
            error: 'Username and password do not match.'
          });
        }
        return token.sign(user);              // get them a token
      })
      .then( token => res.send(token) )       // send the token
      .catch(next);

  });

module.exports = router;