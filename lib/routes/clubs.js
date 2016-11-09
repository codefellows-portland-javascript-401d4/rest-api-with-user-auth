const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const Club = require('../models/club');
const Member = require('../models/member');

router
    .get('/', (req, res, next) => {
        Club.find()
            .then(crews => res.send(crews))
            .catch(next);
    })


// get this to populate all members for the club too.
    .get('/:id', (req, res, next) => {

        var clubId = req.params.id;

        Promise
            .all([
                Club.findById(clubId).lean(), 

                Member.find({clubId})
                .select('name gender')
                .lean()
            ])

            .then(([club, members]) => {
                club.members = members;
                res.send(club);
            }) 
            .catch(next);
    })

    .post('/', bodyParser, (req, res, next) => {
        new Club(req.body).save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        Club.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(saved => res.send(saved))
            .catch(next);
    })

    .put('/:clubId/members/:memberId', bodyParser, (req, res, next) => {
        Member.findById(req.params.memberId)
            .then(member => {
                member.clubId = req.params.clubId;
                return member.save();
            })
            .then(member => res.send(member))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Club.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted))
            .catch(next);
    });

module.exports = router;

