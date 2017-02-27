'use strict';

const async = require('async');
const should = require('should');
const request = require('request');
const appConfig = require('config/config.app');

const url = `http://localhost:${appConfig.testServerPort || 9999}/api/user`;

const userIds = [];

describe('api.user controller', () => {
	context('성공', () => {
		it('api.user 호출 POST CASE1 local', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE2 local 중복실패', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				should.notStrictEqual(200, res.statusCode);

				done();
			});
		});
		it('api.user 호출 POST CASE2 facebook', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'facebook',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				facebook: {
					first_name: 'Firstname',
					last_name: 'Lastname',
					email: 'testcase@testcase.com',
					id: 123123
				},
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.strictEqual(200, res.statusCode);
				should.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 DELETE', (done) => {
			const callbacks = [];

			userIds.forEach((userId) => {
				callbacks.push((callback) => {
					const options = {};
					options.url = url;
					options.form = { user_id: userId };

					request.delete(options, (err, res, body) => {
						if (err) return callback(err);

						body = JSON.parse(body);

						should.strictEqual(200, res.statusCode);
						should.exist(body.response.user_id);

						callback();
					});
				});
			});

			async.series(callbacks, (err) => {
				if (err) throw err;

				done();
			});
		});
	});
	context('실패', () => {
		it('api.user 호출 POST CASE1', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: '',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE2', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: '',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE3', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: '',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE4', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: '',
				confirm_password: 'testcase1234!',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE5', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: '',
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE6', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'local',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				password: 'testcase1234!',
				confirm_password: 'testcase1234!',
				master_key: ''
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE7', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'facebook',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				facebook: {
					first_name: '',
					last_name: 'Lastname',
					email: 'testcase@testcase.com',
					id: 123123
				},
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE8', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'facebook',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				facebook: {
					first_name: 'Firstname',
					last_name: 'Lastname',
					email: '',
					id: 123123
				},
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
		it('api.user 호출 POST CASE9', (done) => {
			const options = {};
			options.url = url;
			options.form = {
				provider: 'facebook',
				email: 'testcase@testcase.com',
				name: 'LastnameFirstname',
				facebook: {
					first_name: 'Firstname',
					last_name: 'Lastname',
					email: 'testcase@testcase.com',
					id: ''
				},
				master_key: appConfig.masterKey
			};

			request.post(options, (err, res, body) => {
				if (err) throw err;

				body = JSON.parse(body);

				should.notStrictEqual(200, res.statusCode);
				should.not.exist(body.response.user_id);

				userIds.push(body.response.user_id);

				done();
			});
		});
	});
});
