const app = require('./lib/app');
const http = require('http');
const port = process.env.PORT || 8080;
require('./lib/setup-mongoose');

const server = http.createServer(app);

server.listen(port, () => {
	console.log('server started on port',
	server.address().port);
});

// server.listen(port, err => {
// 	if(err) console.log('ERROR!', err);
// 	else console.log('app running on port', server.address().port);
// });