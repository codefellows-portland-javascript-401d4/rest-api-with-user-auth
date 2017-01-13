const Team = require('../lib/models/team');
const Coach = require('../lib/models/coach')
const assert = require('chai').assert;

describe('Team model', () => {
    it('validate team name', done => {
        const team = new Team ({
            teamName: 'teamName'
        });

        team.validate(err => {
            if(!err) done();
            else done(err);
        });
    });

    if('teamName is required', done => {
        const team = new Team ();
        team.wins = 5;

        team.validate(err => {
            assert.isOk(err, 'teamName should be required');
            done();
        });        
    });

    it('wins have to be a number', done => {
        const team = new Team({
            teamName: 'team',
            wins: "five"
        });

        team.validate(err => {
            assert.isOk(err, 'expected error: data type should be number');
            done();
        });
    });
});

describe('Coach model', () => {
    it('validate coach name', done => {
        const coach = new Coach ({
            coachName: 'coachName'
        });

        coach.validate(err => {
            if(!err) done();
            else done(err);
        });
    });

    if('coachName is required', done => {
        const coach = new Coach ();
        coach.position = 'Head';

        coach.validate(err => {
            assert.isOk(err, 'coachName should be required');
            done();
        });        
    });

    it('position must be a string', done => {
        const coach = new Coach(); 
        coach.position = null;
            // coachName: 'coach',
            // position: 'head'
        
        coach.validate(err => {
            assert.isOk(err, 'expected error: data type should be string');
            done();
        });
    });
});