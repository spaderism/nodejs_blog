'use strict';

const logger = require('lib/logger')('route:index');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');

const indexGET = (req, res, next) => {
	logger.debug('index');

    let data = null;
    const flashBody = req.flash('flashBody');

    if (flashBody.length) {
        data = flashBody[0];
    } else {
        const meta = {};

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        data = { meta: meta };
    }

    res.render('index', { user: req.session.user });
    endpoint(req, res, data);
};

module.exports = {
	indexGET: indexGET
};
