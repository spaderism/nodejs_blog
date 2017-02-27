'use strict';

const constant = require('config/constant');
const BlogError = require('lib/error/BlogError');

module.exports = {
	notFound: (req, res, next) => {
		const errCode = constant.statusCodes.NOT_FOUND;
		const err = new Error(constant.statusMessages[errCode]);

		err.status = errCode;

		next(err);
	},

	errorHandler: (err, req, res, next) => {
		const errCode = err.status || constant.statusCodes.INTERNAL_SERVER_ERROR;
		res.status(errCode);

		if (req.url.startsWith('/api')) {
			new BlogError(req, res, err);
		} else {
			const errMessage = err.message || constant.statusMessages[errCode];
			res.render('error', { errCode: errCode, errMessage: errMessage });
			new BlogError(req, res, err);
		}
	}
};
