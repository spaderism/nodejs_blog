'use strict';

const logger = require('lib/logger')('middleware/auth.js');
const moment = require('moment');

module.exports = (req, res, next) => {
    logger.debug('auth middleware 실행.');

    const execPath = [ '/swagger', '/swagger-ui' ];

    if (!req.isAuthenticated()) {
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

                        return next();
                    });
                }
            });
        } else {
            if (!execPath.includes(req.url)) return next();

            return res.redirect('/login');
        }
    } else {
        next();
    }
};
