const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Member = require('../models/member');

router 
    .get('/', (req, res, next) => {
        var query = {};

        for (var key in req.query) {
            query[key] = req.query[key];
        }

        Member.find(query)
            .then(members => res.send(members))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Member.findById(req.params.id)
            .then(member => res.send(member))
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Member(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);    
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Member.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Member.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    });

module.exports = router;