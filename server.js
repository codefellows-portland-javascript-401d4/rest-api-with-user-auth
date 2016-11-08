require('dotenv').load();
console.log(process.env);

const app = require('./lib/app');
const port = process.env.PORT;
const http = require('http');
const server = http.createServer(app);
require('./lib/setup-mongoose');

server.listen(port, () => {
  console.log('server running at ', server.address());
});