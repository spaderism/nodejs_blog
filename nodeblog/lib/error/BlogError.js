'use strict';

const responsor = require('lib/responsor');

class BlogError extends Error {
	constructor(req, res, resData) {
		super();
		this.name = 'BlogError';
		this.type = 'API';
		this.response(req, res, resData);
		Error.captureStackTrace(this, BlogError);
	}

	response(req, res, resData) {
		responsor(req, res, resData, {
			stack: (this.stack).split('\n').map((value) => {
				return value.trim();
			})
		});
	}
};

module.exports = BlogError;
