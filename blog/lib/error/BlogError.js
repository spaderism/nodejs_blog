'use strict';

const endpoint = require('lib/endpoint');
const constant = require('config/constant');
const logger = require('lib/logger')('lib:error:BlogError');

class BlogError extends Error {
	constructor(req, res, err) {
		logger.error(err);

		super();
		this.name = 'BlogError';
		this.type = 'API';

		const meta = {};
		meta.code = constant.statusCodes.INTERNAL_SERVER_ERROR;
		meta.message = err.message || constant.statusMessages[meta.code];

		this.response(req, res, { meta: meta });
		Error.captureStackTrace(this, BlogError);
	}

	response(req, res, resData) {
		endpoint(req, res, resData, {
			stack: (this.stack).split('\n').map((value) => {
				return value.trim();
			})
		});
	}
};

module.exports = BlogError;
