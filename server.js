const http = require('http');
const port = process.env.PORT || 3000;
const app = require('./lib/app');
require('./lib/mongooseSetup');

const server = http.CreateServer(app);
server.listen(port, () => {
    console.log('server listening on', server.address());
});