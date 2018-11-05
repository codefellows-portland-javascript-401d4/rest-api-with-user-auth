const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');
const ensureRole = require('../auth/ensure-role');

router
    .get('/', (req, res, next) => {
        console.log('router GET all');
        const query = {};
        User.find(query)
            .then(users => res.send(users))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        console.log('router GET one');
        User.findById(req.params.id)
        .then(user => res.send(user))
        .catch(next);
    })

    .delete('/:id', ensureRole('admin','super-user'), (req, res, next) => {
        console.log('router DELETE');
        User.findByIdAndRemove(req.params.id)
        .then(removed => res.send(removed))
        .catch(next);
    })

    .post('/', ensureRole('admin','super-user'), jsonParser, (req, res, next) => {
        new User(req.body).save()
        .then(saved => res.send(saved))
        .catch(next);
    })

    .put('/:id', ensureRole('admin','super-user'), jsonParser, (req, res, next) => {
        console.log('router PUT');
        User.findByIdAndUpdate(req.params.id, req.body)
        .then(updated => res.send(updated))
        .catch(next);
    });


module.exports = router;
