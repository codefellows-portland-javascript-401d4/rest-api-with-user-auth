const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Role = require('../models/role');
const ensureRole = require('../auth/ensure-role');


router
    .get('/', (req, res, next) => {
        console.log('router GET all');
        const query = {};
        Role.find(query)
            .then(roles => res.send(roles))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        console.log('router GET one');
        Role.findById(req.params.id)
        .then(role => res.send(role))
        .catch(next);
    })

    .post('/', ensureRole('admin','super-user'), jsonParser, (req, res, next) => {
        new Role(req.body).save()
        .then(saved => res.send(saved))
        .catch(next);
    })

    .delete('/:id', ensureRole('admin','super-user'), (req, res, next) => {
        console.log('router DELETE');
        Role.findByIdAndRemove(req.params.id)
        .then(removed => res.send(removed))
        .catch(next);
    })

    .put('/:id', ensureRole('admin','super-user'), jsonParser, (req, res, next) => {
        console.log('router PUT');
        Role.findByIdAndUpdate(req.params.id, req.body)
        .then(updated => res.send(updated))
        .catch(next);
    });

module.exports = router;
