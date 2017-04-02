'use strict';

const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const logger = require('lib/logger')('lib/errorHandler.js');

module.exports = {
	notFound: (req, res, next) => {
		const errCode = constant.statusCodes.NOT_FOUND;
		const err = new Error(constant.statusMessages[errCode]);

		err.status = errCode;

		return res.status(errCode).render('error', { errCode: errCode, errMessage: err.message });
	},

	errorHandler: (err, req, res, next) => {
		logger.error(err.stack);

		let data = undefined;
		const errCode = err.status || constant.statusCodes.INTERNAL_SERVER_ERROR;
		const errMessage = err.message || constant.statusMessages[errCode];
		const error = {
			errMessage: errMessage,
			errStack: (err.stack).split('\n').map((value) => {
				return value.trim();
			})
		};

		if (req.url.startsWith('/api')) {
			data = { meta: { code: errCode, message: errMessage }};
		} else {
			res.status(errCode);
			res.render('error', { errCode: errCode, errMessage: errMessage });
		}

		endpoint(req, res, data, error);
	}
};
