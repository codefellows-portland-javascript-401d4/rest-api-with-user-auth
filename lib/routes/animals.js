const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Animal = require('../model/animal');

router
//animals
    .get('/', function (req, res, next) {
	const query = {};
	Animal.find(query)
            .then(animals => res.send(animals ))
            .catch(next);
})
  
//carnivores
    .get('/carnivores', function (req, res, next) {
	Animal.find({nutrition: 'carnivore'})
            .then(animals => res.send(animals ))
            .catch(next);
})

//omnivores
    .get('/omnivores', function (req, res, next) {
	Animal.find({nutrition: 'omnivore'})
            .then(animals => res.send(animals ))
            .catch(next);
})

//herbivores
    .get('/herbivores', function (req, res, next) {
	    Animal.find({nutrition: 'herbivore'})
            .then(animals => res.send(animals ))
            .catch(next);
})

//find by genus
    .get('/genus/:genus', function (req, res, next) {
	    Animal.find({genus: req.params.genus})
            .then(animal => res.send(animal ))
            .catch(next);
})

//find by id
    .get('/:id', function (req, res, next) {
	    Animal.find({_id: req.params.id})
            .then(animal => res.send(animal ))
            .catch(next);
})


//allows users to add animals to the db
    .post('/', bodyParser, function(req, res, next){
	    new Animal(req.body).save()
        .then (saved => res.send(saved ))
        .catch(next);
})

//allows users to update animals by id
    .put('/:id', bodyParser, function(req, res, next){
	    Animal.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
})


//allows users to delete animals by id
    .delete('/:id', function (req, res, next) {
	Animal.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
});

module.exports = router;



