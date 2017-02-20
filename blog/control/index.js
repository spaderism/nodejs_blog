'use strict';

const endpoint = require('lib/endpoint');
const logger = require('lib/logger')('control:index');

const indexGET = (req, res, next) => {
	logger.debug('index');

    res.render('index', { user: req.session.user });

    endpoint(req, res);
};

module.exports = {
	indexGET: indexGET
};
