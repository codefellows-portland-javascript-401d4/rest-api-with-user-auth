
require('dotenv').load();

const app = require('./lib/app');
const http = require('http');
const port = process.env.PORT;
require('./lib/mongoose-config');

const server = http.createServer(app);

server.listen(port, () => {
    console.log('server listening on: ', server.address());
});
