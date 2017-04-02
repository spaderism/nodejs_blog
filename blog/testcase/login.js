'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/app');

describe('login', () => {
	context('성공', () => {
		it('login 호출 GET', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/login`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('logout 호출 GET', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/logout`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('facebook 호출 GET', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/facebook`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('facebook-callback 호출 GET', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/facebook-callback`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
	});
});
