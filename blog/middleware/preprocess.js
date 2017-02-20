'use strict';

const xss = require('xss');
const async = require('async');
const swagger = require('swagger/api.docs.js');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const logger = require('lib/logger')('middleware:preprocess');

class Validation {
	static apiloginpost(req, res) {
		const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		const email = req.body.email;
		if (!regex.test(email)) {
			return { isValid: false, message: `invalid email: ${email}`};
		}

		return { isValid: true };
	}

	static apiuserpost(req, res) {
		const providers = [ 'local', 'facebook', 'github', 'google' ];

		const meta = {};
		meta.code = constant.statusCodes.BAD_REQUEST;

		const provider = req.body.provider;
		if (!providers.includes(provider)) {
			return { isValid: false, message: `invalid email: ${provider}`};
		}

		if (provider === 'local') {
			const password = req.body.password;
			const confirmPassword = req.body.confirm_password;

			if (!password || !confirmPassword || password !== confirmPassword || password.length < 8) {
				return { isValid: false, message: 'check password validation'};
			}
		}

		const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		const email = req.body.email;

		if (!regex.test(email)) {
			return { isValid: false, message: `invalid email: ${email}`};
		}

		return { isValid: true };
	};
};

module.exports = (req, res, next) => {
	logger.debug('유효성 검사 미들웨어');

	if (!req.url.startsWith('/api')) return next();

	const method = req.method;
	const validation = Validation[`${req.url.split('/').join('')}${method.toLowerCase()}`];

	if (validation) {
		const validation = Validation[`${req.url.split('/').join('')}${method.toLowerCase()}`](req, res);

		if (!validation.isValid) {
			const meta = {};
			meta.code = constant.statusCodes.BAD_REQUEST;
			meta.message = validation.message;

			return endpoint(req, res, { meta: meta });
		}
	}

	const pathSpec = swagger.paths[req.url] || {};
	const methodSpec = pathSpec[method] || {};
	const parameters = methodSpec.parameters || [];

	async.forEachOf(parameters, (paramSpec, index, callback) => {
		const paramName = paramSpec.name;
		const paramType = paramSpec.type;
		const isEssential = paramSpec.required || false;
		let paramVal = req.method === 'GET'
					 ? req.query[paramName]
					 : req.body[paramName];

		if (isEssential) {
			if (!paramVal) {
				return callback(new Error(`:BAD:${paramName} value is required`));
			}

			if (typeof paramVal !== paramType) {
				return callback(new Error(`:BAD:${paramName} value type is not ${paramType}`));
			}

			if (paramVal) {
				paramVal = xss(paramVal);
				return callback();
			}
		}
		callback();
	}, (err) => {
		if (err) {
			if ((err.message).startsWith(':BAD:')) {
				err.message = (err.message).replace(':BAD:', '');

				logger.debug(err.message);

				const meta = {};
				meta.code = constant.statusCodes.BAD_REQUEST;
				meta.message = err.message;

				return endpoint(req, res, { meta: meta });
			} else {
				logger.error(err);
				throw err;
			}
		}

		next();
	});
};
