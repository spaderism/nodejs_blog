'use strict';

const constant = require('config/constant');
const BlogError = require('lib/error/BlogError');

module.exports = {
	notFound: (req, res, next) => {
		const errCode = constant.statusCodes.NOT_FOUND;
		const err = new Error(constant.statusMessages[errCode]);

		err.status = errCode;

		const contentType = req.headers['content-type'] || '';
		if (contentType.includes('application/json')) {
			next(err);
		} else {
			res.render('error', { error: err });
		}
	},

	errorHandler: (err, req, res, next) => {
        new BlogError(req, res, err);
	}
};
