'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/config.app');

describe('login controller', () => {
	context('성공', () => {
		it('로그인 페이지 호출(GET)', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/login`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('로그아웃 호출(GET)', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/logout`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('페이스북 호출(GET)', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/facebook`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('페이스북 콜백 호출(GET)', (done) => {
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
