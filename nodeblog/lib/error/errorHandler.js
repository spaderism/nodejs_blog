'use strict';

const logger = require('lib/logger');
const constant = require('config/constant');

module.exports = {
	notFound: (req, res, next) => {
		const meta = {};
		meta.code = constant.statusCodes.NOT_FOUND;
		meta.message = constant.statusMessages[meta.code];
		const BlogError = require('lib/error/BlogError');
		throw new BlogError(req, res, { meta: meta });
	},

	errorHandler: (err, req, res, next) => {
		if (err.type === 'API') return;
		// set locals, only providing error in development
		res.locals.message = err.message;
		logger.error(res.locals.message);
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// render the error page
		res.status(err.status || 500);
		res.render('error');
	}
};
