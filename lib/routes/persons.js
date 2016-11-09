const router = require('express').Router();
const bodyParser = require('body-parser').json();
const Team = require('../models/team');
const Person = require('../models/person');

router
    .get('/', (req, res, next) => {
        const query = {};
        Person.find(query)
        // .lean()
        .then(person => res.send(person))
        .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Person.findById(req.params.id)
        .then(person => res.send(person))
        .catch(next);
    })

    .delete('/:id', bodyParser, (req, res, next) => {
        Person.removeById(req.params.id)
            .then(removed => res.send(removed))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Person.findByIdAndUpdate(req.params.id, req.body)
            .then(update => res.send(update))
            .catch(next);
    })

    .post('/:id', bodyParser, (req, res, next) => {
        new Person(req.body).save({new: true})
        .then(save => res.send(save))
        .catch(next);
    })

module.exports = router;