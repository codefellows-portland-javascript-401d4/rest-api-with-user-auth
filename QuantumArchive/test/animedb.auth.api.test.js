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
    const seras = {
        username: 'Seras Victoria',
        password: 'Vampire'
    };
    let adminToken = '';
    let userToken = '';
    let adminId = '';
    let userId = '';
    const updateRequest = {
        attackpower: 9999
    };

    it('create a new admin and retrieve a token', done => {
        request
            .post('/users/signup')
            .send(alucard)
            .then(res => {
                assert.isOk(res.body.token);
                adminToken = res.body.token;
                adminId = res.body.user_id;
                done();
            })
            .catch(err => {
                console.error(err);
                done();
            });
    });

    it('create a new regular user and retrieves a token', done => {
        request
            .post('/users/signup')
            .send(seras)
            .then(res => {
                assert.isOk(res.body.token);
                userToken = res.body.token;
                userId = res.body.user_id;
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
                console.error(err);
                done();
            });
    });

    it('makes a /POST request to animechars with admin token', done => {
        request
            .post('/animechars')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(keiichi)
            .then(res => {
                assert.isOk(res.body._id);
                keiichi._id = res.body._id;
                keiichi.__v = 0;
                assert.deepEqual(res.body, keiichi);
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    it('uses /PUT to update character with a given showId with admin privelege', done => {
        request
            .put('/animeshows/' + higurashi._id + '/character/' + keiichi._id)
            .set('Authorization', `Bearer ${adminToken}`)
            .then(res => {
                assert.deepEqual(res.body, keiichi);
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    it('calls /GET on keiichi which should now have the show field populated', done => {
        request
            .get('/animechars')
            .set('Authorization', `Bearer ${userToken}`)
            .then(res => {
                keiichi.showId = { _id: higurashi._id, showname: higurashi.showname };
                assert.deepEqual(res.body[0], keiichi);
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    it('calls /GET on animeshows which should now have a character field populated', done => {
        request
            .get('/animeshows/' + higurashi._id)
            .set('Authorization', `Bearer ${adminToken}`)
            .then(res => {
                keiichi.showId = higurashi._id;
                higurashi.characters.push(keiichi);
                higurashi.airdate = new Date(higurashi.airdate).toISOString();
                delete higurashi.__v;
                assert.deepEqual(res.body, higurashi);
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    it('calls /PUT on animechars to update keiichi using userToken', done => {
        request
            .put('/animechars/' + keiichi._id)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updateRequest)
            .then(res => {
                keiichi.attackpower = 9999;
                assert.deepEqual(res.body, keiichi);
                done();
            })
            .catch(err => {
                console.error(err);
                done(err);
            });
    });

    describe('checks whether you can delete a user given admin privileges', () => {
        it('makes a /DEL with only a user level privilege', done => {
            request
                .del('/users/' + userId)
                .set('Authorization', `Bearer ${userToken}`)
                .then(res => {
                    done('this should fail with 400 level error');
                })
                .catch(err => {
                    assert.equal(err.response.body.error, 'not authorized');
                    done();
                });
        });
        
        it('makes a /DEL request to remove Seras using Alucard', done => {
            request
                .del('/users/' + userId)
                .set('Authorization', `Bearer ${adminToken}`)
                .then(res => {
                    assert.isOk(res.body);
                    assert.equal(res.body.username, 'Seras Victoria');
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });

        it('makes a /DEL request to remove Seras using Alucard', done => {
            request
                .del('/users/' + adminId)
                .set('Authorization', `Bearer ${adminToken}`)
                .then(res => {
                    assert.isOk(res.body);
                    assert.equal(res.body.username, 'Alucard');
                    done();
                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });
        });
    });
});