'use strict';

const app = require('app');
const http = require('http');
const logger = require('lib/logger')('testcase/index');

const database = require('database/database');
const appConfig = require('config/appConfig');

const port = appConfig.testServerPort || 9999;

app.set('port', port);
app.on('close', (callback) => {
	logger.debug('서버 객체가 종료됩니다.');
	if (database.mongodb) {
		database.mongodb.close();
	}
	callback();
});

const onError = (error) => {
  	if (error.syscall !== 'listen') { throw error; }

  	const bind = typeof port === 'string'
               ? 'Pipe ' + port
               : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
    	case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
      		break;
    	case 'EADDRINUSE':
      		console.error(bind + ' is already in use');
      		process.exit(1);
      		break;

		default:
			throw error;
  	}
};

process.on('uncaughtException', (err) => {
  logger.debug('uncaughtException 발생함 : ' + err);
  logger.debug('서버 프로세스 종료하지 않고 유지함.');
  logger.debug(err.stack);
});

process.on('SIGTERM', () => {
  logger.debug('프로세스가 종료됩니다.');
  app.close();
});

const server = http.createServer(app);

before((done) => {
	server.on('error', onError);
	server.listen(port, () => {
		const addr = server.address();
		const bind = typeof addr === 'string'
	               ? 'pipe ' + addr
	               : 'port ' + addr.port;

		logger.debug('테스트 서버 스타트 Listening on ' + bind);

		database.init(app, appConfig);

		done();
	});
});

after((done) => {
	server.close(() => {
		logger.debug('테스트 서버 종료');
		done();
	});
});
