const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Staff = require('../models/staff');

router
  .get('/', (req, res, next) => {
    const query = {};
    if(req.query.name) query.name = req.query.name;

    Staff.find()
      .select('name department title')
      .populate({
        path: 'department',
        select: 'name'
      })
      .lean()
      .then(staff => res.send(staff))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Staff.findById(req.params.id)
      .then(staff => res.send(staff))
      .catch(next)
  })

  .get('/departments/:id', (req, res, next) => {
    Staff.find({department: req.params.id})
      .then(staff => res.send(staff))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Staff.findByIdAndRemove(req.params.id)
    .then(deleted => res.send(deleted))
    .catch(next);
  })

  .put('/:id', bodyParser, (req, res, next) => {
    Staff.findByIdAndUpdate(req.params.id, req.body)
      .then(saved => res.send(saved))
      .catch(next);
  })

  .post('/', bodyParser, (req, res, next) => {
    new Staff(req.body).save()
      .then(saved => res.send(saved))
      .catch(next);
  })

module.exports = router;