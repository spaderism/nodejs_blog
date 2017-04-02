'use strict';

const logger = require('lib/logger')('route/index.js');
const appConfig = require('config/app');
const endpoint = require('lib/endpoint');

const indexGET = (req, res, next) => {
	logger.debug('index');

    res.render('index', {
    	user: req.session.user,
    	category: appConfig.category
    });

    endpoint(req, res);
};

module.exports = {
	indexGET: indexGET
};
