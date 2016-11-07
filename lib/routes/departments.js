const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Depts = require('../models/departments');
const Staff = require('../models/staff');

router
  .get('/', (req, res, next) => {
    const query = {};
    if(req.query.name) query.name = req.query.name;

    Depts.find(query)
      .then(depts => res.send(depts))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Depts.findById(req.params.id)
      .then(depts => res.send(depts))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Depts.findByIdAndRemove(req.params.id)
      .then(deleted => res.send(deleted))
      .catch(next);
  })

  .post('/', bodyParser, (req, res, next) => {
    new Depts(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  })

  .put('/:id', bodyParser, (req, res, next) => {
    Depts.findByIdAndUpdate(req.params.id, req.body)
    .catch(next);
  });

module.exports(router);