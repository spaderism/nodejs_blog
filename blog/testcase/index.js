'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/config.app');

const url = `http://localhost:${appConfig.testServerPort || 9999}`;

describe('index controller', () => {
	context('성공', () => {
		it('페이지 호출(GET)', (done) => {
			const options = {};
			options.url = url;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
	});
});
