'use strict';

const logger = require('lib/logger')('middleware/login.js');

module.exports = (req, res, next) => {
    logger.debug('login interceptor 실행.');

    const execPath = [ '/login' ];
    if (execPath.indexOf(req.url) === -1) { return next(); }

    logger.debug('clear login data before');

    req.session.destroy();
    res.clearCookie('user');
    req.logout();

    next();
};
