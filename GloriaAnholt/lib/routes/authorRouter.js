/** Created by Gloria Anholt on 11/7/16. **/

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Author = require('../models/authors');


router
  .get('/', (req, res, next) => {
    Author.find()
      .select('name YOB YOD books -_id')
      .lean()
      .then(authors => res.send(authors))
      .catch(next);
  })

  .post('/', bodyParser, (req, res, next) => {
    new Author(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  });


module.exports = router;