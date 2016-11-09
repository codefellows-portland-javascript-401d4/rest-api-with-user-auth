const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const User = require('../models/user');

// router
//   .post('/validate', ensureAuth, (req, res, next) => {
//     res.send({valid: true});
//   });

router
  .post('/signup', bodyParser, (req, res, next) => {
    console.log('in signup route', req.body);
    const {username, password} = req.body;
    delete req.body.password;
    console.log(username, password);

    if(!username || !password) {
      console.log('no username or password err');
      return next({
        code: 400,
        error: 'Username and Password required.'
      });
    }

    console.log('Past the if statement in auth.js');

    User.find({ username })
      .count()
      .then(count => {
        console.log('username: ', username);
        if (count > 0) throw {
          code: 400,
          error: `Username ${username} already exists.`
        };
        const user = new User(req.body);
        user.generateHash(password);
        return user.save();
      })
      .then(user => token.sign(user))
      .then(token => res.send({token}))
      .catch(next);

  });

router
  .post('/signin', bodyParser, (req, res, next) => {
    const { username, password } = req.body;
    delete req.body.password;
    
    User.findOne({username})
      .then(user => {
        if (!user || !user.compareHash(password)) {
          throw {
            code: 400,
            error: 'Invalid username or password'
          };
        }
        return token.sign(user);
      })
      .then(token => res.send(token))
      .catch(next);
  });

module.exports = router;