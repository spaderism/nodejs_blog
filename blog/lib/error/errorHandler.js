'use strict';

const constant = require('config/constant');
const BlogError = require('lib/error/BlogError');
const logger = require('lib/logger')('lib:error:errorHandler');

module.exports = {
	notFound: (req, res, next) => {
		const errCode = constant.statusCodes.NOT_FOUND;
		const err = new Error(constant.statusMessages[errCode]);

		err.status = errCode;

		if (req.url.startsWith('/api')) {
			next(err);
		} else {
			res.render('error', { error: err });
		}
	},

	errorHandler: (err, req, res, next) => {
		if (req.url.startsWith('/api')) {
			throw new BlogError(req, res, err);
		} else {
			logger.error(err.stack);

			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err.stack
			});
		}
	}
};
