'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/config.app');

describe('swagger', () => {
	context('성공', () => {
		it('swagger 호출 GET', (done) => {
			const url = `http://localhost:${appConfig.testServerPort || 9999}/swagger`;

			const options = {};
			options.url = url;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('swagger-ui 호출 GET', (done) => {
			const url = `http://localhost:${appConfig.testServerPort || 9999}/swagger-ui`;

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
