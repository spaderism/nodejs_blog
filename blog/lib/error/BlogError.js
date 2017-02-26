'use strict';

const endpoint = require('lib/endpoint');
const constant = require('config/constant');
const logger = require('lib/logger')('lib:error:BlogError');

class BlogError {
	constructor(req, res, err) {
		logger.error(err.stack);

		if (req.url.startsWith('/api')) {
			const meta = {
				code: err.status || constant.statusCodes.INTERNAL_SERVER_ERROR,
				message: err.message || constant.statusMessages[meta.code]
			};

			this.response(req, res, { meta: meta }, err);
		} else {
			this.response(req, res, undefined, err);
		}
	}

	response(req, res, resData, err) {
		const resMeta = resData ? resData.meta : {};

		endpoint(req, res, resData, {
			errMessage: resMeta.message || constant.statusMessages[constant.statusCodes.INTERNAL_SERVER_ERROR],
			errStack: (err.stack).split('\n').map((value) => {
				return value.trim();
			})
		});
	}
};

module.exports = BlogError;
