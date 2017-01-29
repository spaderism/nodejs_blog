'use strict';

const logger = require('lib/logger')('middleware:login');

module.exports = (req, res, next) => {
    logger.debug('login interceptor 실행.');

    const execPath = [ '/login' ];
    if (execPath.indexOf(req.url) === -1) { return next(); }

    const session = req.session;
    if (session.user) {
        logger.debug('clear login data before');
        delete session.user;
    }

    next();
};
