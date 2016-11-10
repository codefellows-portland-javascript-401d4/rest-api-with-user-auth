const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Ship = require('../models/ship');

router
  .get('/', (req, res, next) => {
    Ship.find()
      .then(ships => res.send(ships))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Ship.findById(req.params.id)
      .then(ship => res.send(ship))
      .catch(next);
  })

  .post('/', bodyParser, (req, res, next) => {
    new Ship(req.body).save()
      .then(newShip => res.send(newShip))
      .catch(next);
  })

  .put('/:id', bodyParser, (req, res, next) => {
    Ship.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then(newShip => res.send(newShip))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Ship.findByIdAndRemove(req.params.id)
      .then(ship => res.send(ship))
      .catch(next);
  });

module.exports = router;