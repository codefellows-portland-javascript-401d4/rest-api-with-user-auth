const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../lib/app');
const connection = require('../lib/mongooseSetup');
chai.use(chaiHttp);
mongoose.Promise = Promise;

describe('Checking access to anime DB with user auth enabled', done => {
    before( done => {
        const dropAnimes = () => {
            console.log('hi mom');
            connection.db.dropCollection('animechars', (err, result) => {
                if (err) done(err);
                else connection.db.dropCollection('animeshows', (err2, result2) => {
                    if (err2) done(err2);
                    else done();
                });
            });
        };
        if (connection.readState === 1) dropAnimes();
        else connection.on('open', dropAnimes);
    });

    const request = chai.request(app);
    const keiichi = {
        name: 'Keiichi Maebara',
        age: 16,
        power: 'Breaking Fate',
        attackpower: 8,
        hair_color: 'brown',
    };
    const higurashi = {
        showname: 'Higurashi no Naku Koro Ni',
        airdate: '2006-04-04',
        genre: 'mystery horror',
        characters: []
    };
    let show_id = '';
    const alucard = {
        username: 'Alucard',
        password: 'Hellsing',
        roles: ['admin']
    };
    let adminToken = '';

    it('create a new admin and retrieve a token', done => {
        request
            .post('/users/signup')
            .send(alucard)
            .then(res => {
                assert.isOk(res.body.token);
                adminToken = res.body.token;
                done();
            })
            .catch(err => {
                console.error(err);
                done();
            });
    });

    it('makes a /POST request to animeshows which can only be done with admin token', done => {
        request
            .post('/animeshows')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(higurashi)
            .then(res => {
                assert.isOk(res.body._id);
                higurashi._id = res.body._id;
                higurashi.__v = 0;
                keiichi.showId = higurashi._id;
                done();
            })
            .catch(err => {
                // console.error(err);
                done();
            });
    });

    it('makes a /POST request to animechars with admin token', done => {
        request
            .post('/animechars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(keiichi)
            .then(res => {
                console.log(res.body);
                done();
            })
            .catch(err => {
                // console.error(err);
                done(err);
            });
    });
});