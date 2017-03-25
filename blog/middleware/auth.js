'use strict';

const logger = require('lib/logger')('middleware/auth.js');
const routeInfos = require('config/route').routeInfos;
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const moment = require('moment');
const url = require('url');

module.exports = (req, res, next) => {
    logger.debug('auth middleware 실행.');

    const pathname = url.parse(req.url).pathname;
    const routeInfo = routeInfos.filter((ele, idx) => {
        return ele.path === pathname;
    })[0];

    logger.debug(`path: ${pathname} auth require: ${routeInfo.auth}`);

    if (!routeInfo.auth) return next();

    const unAuthHandler = () => {
        if (pathname.startsWith('/api')) {
            const meta = {};
            meta.code = constant.statusCodes.UNAUTHORIZED;
            meta.message = constant.statusMessages[meta.code];

            return endpoint(req, res, { meta: meta });
        }

        res.redirect('/login');
        return endpoint(req, res);
    };

    if (!req.isAuthenticated()) {
        logger.debug(`auth: ${req.isAuthenticated()}`);

        const userCookie = req.cookies.user;

        if (userCookie) {
            const conditions = { session_id: userCookie };
            const database = req.app.get('database');

            database.mongodb.UserModel.findByConditions(conditions, (err, users) => {
                if (err) return next(err);

                if (users) {
                    const user = users[0];

                    req.login(user, (err) => {
                        if (err) return next(err);

                        req.session.user = {
                            email: user.email,
                            name: user.name,
                            created: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
                            updated: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')
                        };

                        logger.debug('userCookie 로 인증 통과, 세션 만듬');
                        return next();
                    });
                } else {
                    logger.debug('userCookie 로 인증 통과하지 못함');
                    return unAuthHandler();
                }
            });
        } else {
            logger.debug('userCookie 존재하지 않음. 인증 통과하지 못함');
            return unAuthHandler();
        }
    } else {
        logger.debug(`인증 성공 auth: ${req.isAuthenticated()}`);
        return next();
    }
};
