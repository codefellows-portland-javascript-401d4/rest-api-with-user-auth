const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Book = require('../models/books');

router
    .post('/', bodyParser, (req, res, next)=> {
        new Book(req.body).save()
        .then(saved => res.send( saved ))
        .catch(next);
    })

    .get('/', (req, res, next) => {
        const query = {}; 

        if(req.query.name) query.name = req.query.name;

        Book.find(query)
            .then(books => res.send(books ))
            .catch(next);
    })

    .get('/sortbybooks', (req, res, next) => {
        const query = {}; 

        Book.find(query)
            .sort({ nbrBooks: 1 })
            .then(books => res.send(books ))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Book.findById(req.params.id)
            .then(book => res.send(book ))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next)=> {
        new Book(req.body).save()
            .then(saved => res.send(saved ))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Book.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted ))
            .catch(next);
    })


module.exports = router;