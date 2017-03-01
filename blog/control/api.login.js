'use strict';

const passport = require('passport');
const endpoint = require('lib/endpoint');
const constant = require('config/constant');
const appConfig = require('config/config.app');
const logger = require('lib/logger')('control:api:login');

const loginPOST = (req, res, next) => {
	passport.authenticate('login', (err, user) => {
        if (err) return next(err);

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.UNAUTHORIZED,
            meta.message = req.flash('message')[0];

            return endpoint(req, res, { meta: meta });
        }

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        if (!req.body.useCookie) return endpoint(req, res, {
            meta: meta, response: { email: req.body.email, session_id: req.sessionID }
        });

        const database = req.app.get('database');
        database.mongodb.UserModel.findByEmailAndUpdate(req.body.email, { $set: { session_id: req.sessionID } }, (err) => {
            if (err) next(err);

            res.cookie('user', req.sessionID, appConfig.cookie);

            logger.debug('쿠키 저장함. %s', req.sessionID);

            endpoint(req, res, { meta: meta, response: { email: req.body.email, session_id: req.sessionID } });
        });
    })(req, res, next);
};

module.exports = { loginPOST: loginPOST };
