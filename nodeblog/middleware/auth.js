'use strict';

const moment = require('moment');
const logger = require('lib/logger')('middlewares:auth');
const userDBA = require('database/mongo/user');

module.exports = (req, res, next) => {
    logger.debug('auth middleware 실행.');

    const execPath = [  ];

    if (execPath.indexOf(req.url) === -1) { return next(); }

    const session = req.session.user;
    if (!session) {

        const userCookie = req.cookies.user;
        if (userCookie) {

            const conditions = { session_id: userCookie };
            userDBA.findByConditions(conditions, (err, users) => {
                if (err) { return next(err); }
                if (!users) {
                    const user = users[0];
                    req.session.user = {
                        email: user.email,
                        name: user.name,
                        created: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
                        updated: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')
                    };
                    next();
                }
            });

        }

        return res.redirect('/loginGET');
    }

    next();
};
