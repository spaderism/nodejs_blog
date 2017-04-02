'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/app');

const url = `http://localhost:${appConfig.testServerPort || 9999}/notfound`;

describe('testcase exception', () => {
	context('실패', () => {
		it('NOT FOUND', (done) => {
			const options = {};
			options.url = url;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.notStrictEqual(200, res.statusCode);

				done();
			});
		});
	});
});
