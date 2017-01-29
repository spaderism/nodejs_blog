'use strict';

const logger = require('lib/logger')('route:index');
const constant = require('config/constant');
const responsor = require('lib/responsor');

const index = (req, res) => {
	logger.debug('index');

	const meta = {};
    meta.code = constant.statusCodes.SUCCESS;
    meta.message = constant.statusMessages[meta.code];

    responsor(req, res, { meta: meta });

    res.render('index', { user: req.session.user });
};

module.exports = {
	index: index
};
