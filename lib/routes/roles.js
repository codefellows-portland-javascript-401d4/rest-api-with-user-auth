const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();
const Role = require('../models/role');

router
    .get('/', (req, res, next) => {
        console.log('router GET all');
        const query = {};
        Role.find(query)
            .then(roles => res.send(roles))
            .catch(next);
    })

    .post('/', jsonParser, (req, res, next) => {
        new Role(req.body).save()
        .then(saved => res.send(saved))
        .catch(next);
    });

module.exports = router;
