const router = require('express').Router();
const bodyParser = require('body-parser').json();
const Team = require('../models/team');

router
    .get('/', (req, res, next) => {
        const query = {};
        Team.find(query)
        .then(team => res.send(team))
        .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Team.findById(req.params.id)
        .then(team => res.send(team))
        .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Team.findByIdAndUpdate(req.params.id, req.body)
            .then(update => res.send(update))
            .catch(next);
    })

    .post('/:id', bodyParser, (req, res, next) => {
        new Team(req.body).save({new: true})
        .then(save => res.send(save))
        .catch(next);
    })

module.exports = router;