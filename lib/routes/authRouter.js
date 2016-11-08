/** Created by Gloria Anholt on 11/7/16. **/

const router = require('express').Router();
const bodyParser = require('body-parser').json;
const User = require('../models/users');
const token = require('../auth/token');
const ensureAuth = require('../auth/ensure-auth');


router
  .post('/signup', bodyParser, (req, res, next) => {
    console.log('hit signup');
    const { username, password} = req.body;
    console.log('user and pass are ', username, password);
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
      .then( newUser => token.sign(newUser))
      .then( token => res.send(token))
      .catch(next);
  });


module.exports = router;