/** Created by Gloria Anholt on 11/7/16. **/

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Author = require('../models/authors');


router
  .get('/', (req, res, next) => {
    Author.find()
      .lean()
      .then(authors => res.send(authors))
      .catch(next);
  });



module.exports = router;