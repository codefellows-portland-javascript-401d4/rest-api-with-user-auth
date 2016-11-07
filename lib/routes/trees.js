const bodyParser = require('body-parser').json();
const express = require('express');
const router = express.Router();
const Tree = require('../model/tree');
const findEcosystem = require('./ecosystem');

router
//trees
    .get('/', function (req, res, next) {
	const query = req.query;
	console.log(query);
	Tree.find(query)
            .then(trees => res.send(trees ))
            .catch(next);
})
  
//gymno
    .get('/gymnosperms', function (req, res, next) {
	Tree.find({type: 'gymnosperm'})
            .then(trees => res.send(trees ))
            .catch(next);
})

//angio
    .get('/angiosperms', function (req, res, next) {
	Tree.find({type: 'angiosperm'})
            .then(trees => res.send(trees ))
            .catch(next);
})

//find by genus
    .get('/genus/:genus', function (req, res, next) {
	Tree.find({genus: req.params.genus})
            .then(tree => res.send(tree ))
            .catch(next);
})

//find by id
    .get('/:id', function (req, res, next) {
	    Tree.find({_id: req.params.id})
            .then(tree => res.send(tree ))
            .catch(next);
})


//find ecosystem
      .get('/ecosystem', function (req, res, next) {
	Tree.find({name: 'douglas fir'})
          .then (tree => findEcosystem(tree[0].percentage, res))
          .catch(next);
})

//allows users to add trees to the db
    .post('/', bodyParser, function(req, res, next){
	new Tree(req.body).save()
        .then (saved => res.send(saved ))
        .catch(next);
})

//allows users to update trees by id
    .put('/:id', bodyParser, function(req, res, next){
	Tree.findByIdAndUpdate(req.params.id, req.body)
            .then(saved => res.send(saved))
            .catch(next);
})

//allows users to delete the list of trees 
    .delete('/:id', function (req, res, next) {
	Tree.remove({_id : req.params.id})
            .then(deleted => res.send(deleted ))
            .catch(next);
});

module.exports = router;



