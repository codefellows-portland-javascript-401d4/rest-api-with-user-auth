const app = require('./lib/app');
const http = require('http');
require('./lib/mongoose');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`App running on port ${server.address().port}.`);
});