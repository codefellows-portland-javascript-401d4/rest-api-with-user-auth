const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Cat = require('../models/cat');

router
  .get('/', (req, res, next) => {
    Cat.find()
      .select('name age chill')
      .lean()
      .then(cats => res.send(cats))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    console.log('ID', req.params.id);
    Cat.findById(req.params.id)
      .select('name age chill')
      .lean()
      .then(cat => res.send(cat))
      .catch(next);
  })
  .post('/', bodyParser, (req, res, next) => {
    new Cat(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  })
  .put('/:id', bodyParser, (req, res, next) => {
    Cat.findByIdAndUpdate(req.params.id, req.body, {new : true})
      .then(updated => res.send(updated))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Cat.remove({_id : req.params.id})
      .then(() => res.send('You have deleted a resource'))
      .catch(next);
  })
  .delete('/', (req, res, next) => {
    Cat.remove()
      .then(() => res.send('You have deleted everything!'))
      .catch(next);
  });

module.exports = router;
