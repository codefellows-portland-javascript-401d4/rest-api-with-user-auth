const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Movement = require('../models/movement');
const ensureRole = require('../auth/ensure-role');

router 
    .get('/', (req, res, next) => {
        const query = {};
        if(req.query.name) query.name = req.query.name;
        Movement.find(query)
            .then(movements => res.send(movements))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Movement.findById(req.params.id)
            .populate({
                path: 'movementId'
            })
            .then(movements => res.send(movements))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Movement.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Movement(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Movement.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;
