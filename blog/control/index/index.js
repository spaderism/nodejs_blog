'use strict';

const logger = require('lib/logger')('route:index');

const index = (req, res) => {
	logger.debug('index');
    res.render('index', { user: req.session.user });
};

module.exports = {
	index: index
};
