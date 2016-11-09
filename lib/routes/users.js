const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const User = require('../models/user');

router
    .get('/', (req, res, next) => {
        console.log('router GET all');
        const query = {};
        User.find(query)
            .then(users => res.send(users))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        new User(req.body).save()
        .then(saved => res.send(saved))
        .catch(next);
    })

    .put('/:id', jsonParser, (req, res, next) => {
        console.log('router PUT');
        User.findByIdAndUpdate(req.params.id, req.body)
        .then(updated => res.send(updated))
        .catch(next);
    });


module.exports = router;
