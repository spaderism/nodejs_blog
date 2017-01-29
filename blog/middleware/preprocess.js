'use strict';

const xss = require('xss');
const async = require('async');
const appSpec = require('config/appSpec');
const constant = require('config/constant');
const BlogError = require('lib/error/BlogError');
const logger = require('lib/logger')('middleware:preprocess');

module.exports = (req, res, next) => {
	logger.debug('유효성 검사 미들웨어');

	const method = req.method;
	const pathSpec = appSpec.paths[req.url] || {};
	const methodSpec = pathSpec[method] || {};
	const reqSpec = methodSpec.request || [];

	async.forEachOf(reqSpec, (paramSpec, index, callback) => {
		const paramName = paramSpec.name;
		const isEssential = paramSpec.required || false;
		let paramVal = req.method === 'GET'
					 ? req.query[paramName]
					 : req.body[paramName];

		if (isEssential) {
			if (paramVal) {
				paramVal = xss(paramVal);
				return callback();
			}

			return callback(new Error(`:BAD:${paramName} value is required`));
		}
		callback();
	}, (err) => {
		if (err) {
			const meta = {};

			if ((err.message).startsWith(':BAD:')) {
				err.message = (err.message).replace(':BAD:', '');
				meta.code = constant.statusCodes.BAD_REQUEST;
				meta.message = err.message;
			} else {
				meta.code = constant.statusCodes.INTERNAL_SERVER_ERROR;
				meta.message = err.message || constant.statusMessages[meta.code];
			}

			logger.error(err);

			throw new BlogError(req, res, { meta: meta });
		}

		next();
	});
};
