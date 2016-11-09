const mongoose = require('mongoose');

const dbURI = process.env.HEROKU_URI || 'mongodb://Tim:Shrub@ds139937.mlab.com:39937/authpeople';

mongoose.Promise = Promise;
   
mongoose.connection.on('err', function() {
    console.log('Connected to Monmgo at: ' +dbURI );
});

mongoose.connection.on('error', function() {
    console.log('Mongo has encountered a connection error: ' + err);

});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose connection has disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function() {
        console.log('App has closed, terminating connections')
    });
});

module.exports = mongoose.connection;