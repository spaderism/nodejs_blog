'use strict';

const xss = require('xss');
const async = require('async');
const appSpec = require('config/appSpec');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
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
				throw new BlogError(req, res, err);
			}
		}

		next();
	});
};
