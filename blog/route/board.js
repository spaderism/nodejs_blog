'use strict';

const logger = require('lib/logger')('route/board.js');
const endpoint = require('lib/endpoint');

const boardGET = (req, res, next) => {
	logger.debug(req.query.category);

	res.render('index', { user: req.session.user });

    endpoint(req, res);
};

module.exports = { boardGET: boardGET };
