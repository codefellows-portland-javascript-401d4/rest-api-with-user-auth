/** Created by Gloria Anholt on 11/7/16. **/

const router = require('express').Router();
const bodyParser = require('body-parser').json();
const User = require('../models/users');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth')();
const ensureLogin = require('../auth/ensure-login')();
const ensureRole = require('../auth/ensure-role')();


router
  .post('/signup', bodyParser, ensureLogin, (req, res, next) => {

    const password = req.body.password;
    const username = req.body.username;
    delete req.body.password;

    User.find({ username })
      .count()
      .then(count => {
        if (count > 0) {
          throw {
            code: 400,
            error: `Username ${username} already taken. Please try a different name.`
          };
        }

        const newUser = new User(req.body);
        newUser.generateHash(password);
        return newUser.save();
      })
      // newUser.save isn't returning the user model, so fetch it to make the token
      .then(() => { return User.findOne({ username }); })
      .then(user => token.sign(user))   // returns a promise that resolves to a token
      .then(token => res.send({ token }))
      .catch(next);
  })

  .post('/signin', bodyParser, ensureLogin, (req, res, next) => {

    const password = req.body.password;
    const username = req.body.username;
    delete req.body.password;

    User.findOne({ username })                // try to find the user
      .then(user => {
        if (!user.validateHash(password)) {   // check the pswd against the stored pswd
          throw {
            code: 401,
            error: 'Username and password do not match.'
          };
        }
        return token.sign(user);              // returns a promise
      })
      .then(token => res.send({ token }))         // gets the token and sends
      .catch(next);

  })

  .get('/me', ensureAuth, (req, res, next) => {

    User.findById({ _id: req.user.id })
      .select('username favoriteBooks favoriteAuthors -_id')
      .lean()
      .then(userData => res.send(userData))
      .catch(next);
  })

  .get('/admin', ensureAuth, ensureRole, (req, res, next) => {

    User.find({})
      .then(userData => {
        res.send(userData);
      })
      .catch(next);
  });


module.exports = router;