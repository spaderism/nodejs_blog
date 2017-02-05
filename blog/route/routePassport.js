'use strict';

const contLocal = require('control/login/local');
const logger = require('lib/logger')('route:routePassport');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const BlogError = require('lib/error/BlogError');
const appConfig = require('config/appConfig');

module.exports = (app, passport) => {
    // 로그인, 로그아웃
    app.get('/login', contLocal.loginGET);
    app.get('/logout', contLocal.logoutGET);

    // 패스포트 - 로컬 로그인 ajax endpoint
    app.post('/login', (req, res, next) => {
        passport.authenticate('local-login', (err, user) => {
            if (err) return next(err);

            const meta = {};

            if (!user) {
                meta.code = constant.statusCodes.BAD_REQUEST,
                meta.message = req.flash('message')[0];

                return endpoint(req, res, { meta: meta });
            }

            meta.code = constant.statusCodes.SUCCESS;
            meta.message = constant.statusMessages[meta.code];

            if (!req.body.useCookie) return endpoint(req, res, {
                meta: meta, response: [ user ]
            });

            const database = req.app.get('database');
            database.mongodb.UserModel.findByEmailAndUpdate(req.body.email, { $set: { session_id: req.sessionID } }, (err) => {
                if (err) return next(err);
                res.cookie('user', req.sessionID, appConfig.cookie);
                logger.debug('쿠키 저장함. %s', req.sessionID);
                endpoint(req, res, { meta: meta, response: [ user ] });
            });
        })(req, res, next);
    });

    // 패스포트 - 로컬 회원가입 ajax endpoint
    app.post('/signup', (req, res, next) => {
        passport.authenticate('local-signup', (err, user) => {
            const meta = {};

            if (err) {
                logger.error(err);

                meta.code = constant.statusCodes.INTERNAL_SERVER_ERROR;
                meta.message = err.message || constant.statusMessages[meta.code];

                throw new BlogError(req, res, { meta: meta });
            }

            if (!user) {
                meta.code = constant.statusCodes.BAD_REQUEST;
                meta.message = req.flash('message')[0];

                return endpoint(req, res, { meta: meta });
            }

            meta.code = constant.statusCodes.SUCCESS;
            meta.message = constant.statusMessages[meta.code];

            endpoint(req, res, { meta: meta, response: req.body });
        })(req, res, next);
    });

    // 패스포트 - 페이스북 인증 라우팅
    app.get('/facebook',
        passport.authenticate('facebook', {
            scope : 'email'
        })
    );

    // 패스포트 - 페이스북 인증 callback endpoint
    app.get('/facebook-callback', (req, res, next) => {
        passport.authenticate('facebook', (err, user, thirdParty) => {
            if (err) {
                throw new BlogError(req, res, err);
            }

            const meta = {};

            if (!user) {
                meta.code = constant.statusCodes.BAD_REQUEST;
                meta.message = 'Third-party needs membership';

                req.flash('flashBody', { meta: meta, response: thirdParty });
                return res.redirect('/login');
            }

            // 정상인 경우
            logger.debug('계정과 비밀번호가 일치함.');

            req.session.user = user;

            logger.debug('세션 저장함. %o', req.session.user);

            meta.code = constant.statusCodes.SUCCESS;
            meta.message = constant.statusMessages[meta.code];

            req.flash('flashBody', { meta: meta, response: user });
            res.redirect('/');
        })(req, res, next);
    });
};
