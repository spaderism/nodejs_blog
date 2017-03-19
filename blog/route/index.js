'use strict';

const logger = require('lib/logger')('route/index.js');
const endpoint = require('lib/endpoint');

const indexGET = (req, res, next) => {
	logger.debug('index');

    res.render('index', { user: {} });

    endpoint(req, res);
};

module.exports = {
	indexGET: indexGET
};
