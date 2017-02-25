'use strict';

const moment = require('moment');
const appConfig = require('config/config.app');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const logger = require('lib/logger')('middleware:auth');

module.exports = (req, res, next) => {
    logger.debug('auth middleware 실행.');

    const registPath = [ '/signup' ];
    if (registPath.includes(req.url)) {
        if (req.body.master_key !== appConfig.masterKey) {
            const message = 'master_key value is not correct';

            logger.debug(message);

            const meta = {};
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = message;

            return endpoint(req, res, { meta: meta });
        }
    }

    const execPath = [ ];

    const session = req.session.user;
    if (!session) {
        const userCookie = req.cookies.user;
        if (userCookie) {
            const conditions = { session_id: userCookie };
            const database = req.app.get('database');
            database.mongodb.UserModel.findByConditions(conditions, (err, users) => {
                if (err) { return next(err); }
                if (users) {
                    const user = users[0];
                    req.session.user = {
                        email: user.email,
                        name: user.name,
                        created: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
                        updated: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')
                    };
                    return next();
                }
            });
        } else {
            if (!execPath.includes(req.url)) { return next(); }
            return res.redirect('/login');
        }
    } else {
        next();
    }
};
