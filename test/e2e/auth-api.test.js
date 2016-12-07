'use strict';

const request = require('../request');
const assert = require('chai').assert;

describe('auth', () => {
    
    describe('unauthorized', () => {
        
        it('returns code 400 when no token provided', () => {
            request 
                .get('/movements')
                .then(res => done('status code should not be 200'))
                .catch(res => {
                    assert.equal(response.status, 400);
                    assert.equal(res.response.body.error, 'unauthorized, no token provided');
                })
        });

        it('returns code 403 when invalid token provided', () => {
            request
                .get('/movements')
                .set('Authorization', 'Bearer bad token')
                .then(res => done('status should not be 200'))
                .catch(res => {
                    assert.equal(res.status, 403);
                    assert.equal(res.response.body.error, 'unauthorized, invalid token');
                })
        });
    });

    const user = {
        username: 'remdog',
        password: 'frecklefeet'
    };

    describe('user management', () => {

        const badRequest = (url, send, error) => 
            request
                .post(url)
                .send(send)
                .then(
                    () => { throw new Error('status should not be okay'); },
                    res => {
                        assert.equal(res.status, 400);
                        assert.equal(res.response.body.error, error);
                    }
                );

        it('requires username for signup', () => 
            badRequest('/auth/signup', { password: 'abc' }, 'username and password must be supplied')
        );

        it('requires password for signup', () =>
            badRequest('/auth/signup', { username: 'abc' }, 'username and password must be supplied')
        );

        let token = '';

        it('executes signup', () => 
            request
                .post('/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
        );

        it('does not allow use of existing username', () => 
            badRequest('/auth/signup', user, 'username remdog already exists')
        );

        it('ensures token is valid', () => 
            request
                .get('/movements')
                .set('Authorization', `Bearer ${token}`)
                .then(res => assert.ok(res.body))
        );

        it('executes signin', () => 
            request
                .post('/auth/signin')
                .send(user)
                .then(res => assert.equal(res.body.token, token))
        );
    });
});
