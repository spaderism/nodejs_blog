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

		const email = req.body.email;
		const provider = req.body.provider;
		const password = req.body.password;
		const confirmPassword = req.body.confirm_password;
		const regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

		if (!providers.includes(provider)) {
			return { isValid: false, message: `invalid email: ${provider}`};
		}

		if (!password || !confirmPassword || password !== confirmPassword || password.length < 8) {
			return { isValid: false, message: 'check password validation'};
		}

		if (provider !== 'local') {
			if (!req.body[provider].email || !req.body[provider].first_name || !req.body[provider].last_name || !req.body[provider].id) {
				return { isValid: false, message: `invalid ${provider} info` };
			}
			if (!regex.test(req.body[provider].email)) {
				return { isValid: false, message: `invalid ${provider} email: ${req.body[provider].email}`};
			}
			if (req.body[provider].email !== req.body.email) {
				return { isValid: false, message: `not equal ${provider} email with email` };
			}
			if (`${req.body[provider].last_name}${req.body[provider.first_name]}` !== req.body.name) {
				return { isValid: false, message: `not equal ${provider} full_name(${req.body[provider].last_name}${req.body[provider].first_name}) with name(${req.body.name})` };
			}
		}

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
