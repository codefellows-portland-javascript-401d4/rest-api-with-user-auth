const app = require('./lib/app');
const http = require('http');
const port = process.env.PORT || 3200;
/*const connection = */ require('./lib/setupMongoose');

const server = http.createServer(app);
server.listen(port, () => {
	console.log('server running at', server.address());
});
module.exports = server;