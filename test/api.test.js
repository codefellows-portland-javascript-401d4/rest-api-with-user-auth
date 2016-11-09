const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/mongoose');
const app = require('../lib/app');

describe('Staff, Department API Test', () => {

  before(done => {
    function cleardb() {
      const name = 'login';
      connection.db
        .listCollections({name})
        .next((err, collinfo) => {
          if(!collinfo) return done();
          connection.db.dropCollection(name, done);
        });
    }
    const connected = 1;
    if(connection.readyState === connected) cleardb();
    else connection.on('open', cleardb);
  });

  const request = chai.request(app);

});