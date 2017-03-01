'use strict';

const should = require('should');
const request = require('request');
const appConfig = require('config/config.app');

const user = {
	id: null,
	email: 'testcase@testcase.com',
	password: 'testcase1234!'
};

describe('api.login', () => {
	context('성공', () => {
		it('api.user 호출 POST', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/user`;
			options.form = {
				provider: 'local',
				email: user.email,
				name: 'LastnameFirstname',
				password: user.password,
				confirm_password: user.password,
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.exist(body.response.user_id);

				user.id = body.response.user_id;

				done();
			});
		});
		it('api.login 호출 POST', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				email: user.email,
				password: user.password
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.strictEqual(user.email, body.response.email);

				done();
			});
		});
		it('api.login 호출 POST', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				email: user.email,
				password: 'testcase'
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);

				done();
			});
		});
		it('login 호출 GET', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/login`;

			request.get(options, (err, res, body) => {
				if (err) throw err;

				should.strictEqual(200, res.statusCode);

				done();
			});
		});
		it('api.login 호출 POST', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				useCookie: true,
				email: user.email,
				password: user.password
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.strictEqual(user.email, body.response.email);

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
		it('api.user 호출 DELETE', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/user`;
			options.form = {
				user_id: user.id,
				master_key: appConfig.masterKey
			};

			request.delete(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.exist(body.response.user_id);

				done();
			});
		});
	});
	context('실패', () => {
		it('api.login 호출 POST CASE1', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				email: 'testcase',
				password: user.password
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.notStrictEqual(user.email, body.response.email);

				done();
			});
		});
		it('api.login 호출 POST CASE2', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				email: user.email,
				password: 'testcase'
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.notStrictEqual(user.email, body.response.email);

				done();
			});
		});
		it('api.login 호출 POST CASE3', (done) => {
			const options = {};
			options.url = `http://localhost:${appConfig.testServerPort || 9999}/api/login`;
			options.form = {
				email: '',
				password: ''
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.notStrictEqual(user.email, body.response.email);

				done();
			});
		});
	});
});
