
const mongoose = require('mongoose');

// we need a URI that points to our database
const dbURI = process.env.MONGODB_URI;  // || 'mongodb://localhost/housing-test'

mongoose.Promise = Promise;
mongoose.connect( dbURI );

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose default connection open to:', dbURI);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose.connection;
