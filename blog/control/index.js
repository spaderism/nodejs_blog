'use strict';

const logger = require('lib/logger')('control:index');

const indexGET = (req, res, next) => {
	logger.debug('index');
    res.render('index', { user: req.session.user });
};

module.exports = {
	indexGET: indexGET
};
