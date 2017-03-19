'use strict';

const logger = require('lib/logger')('route/login.js');
const endpoint = require('lib/endpoint');
const constant = require('config/constant');
const passport = require('config/passport').passport();
const facebook = passport.authenticate('facebook', { scope: 'email' });
const github = passport.authenticate('github', { scope: 'email' });
const google = passport.authenticate('google', { scope: [ 'profile', 'email' ] });

// 로그인 페이지 요청
const loginGET = (req, res, next) => {
    logger.debug('loginGET method 호출됨');

    const resData = req.session ? req.flash('flashBody')[0] : { provider: 'local' };

    res.render('login', resData);

    endpoint(req, res);
};

const logoutGET = (req, res, next) => {
	logger.debug('logoutGET method 호출됨');
	logger.debug('clear login data before');

    req.session.destroy();
	req.logout();

	res.clearCookie('user');
	res.redirect('/login');

    endpoint(req, res);
};

const facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', (err, user, thirdParty) => {
        if (err) next(err);

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = 'Third-party needs membership';

            req.flash('flashBody', thirdParty);

            res.redirect('/login');

            return endpoint(req, res);
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');

        req.session.user = user;

        logger.debug('세션 저장함. %o', req.session.user);

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        req.login(user, (err) => {
        	if (err) return next(err);

        	res.redirect('/');
        	endpoint(req, res);
        });
    })(req, res, next);
};

const githubCallback = (req, res, next) => {
    passport.authenticate('github', (err, user, thirdParty) => {
        if (err) next(err);

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = 'Third-party needs membership';

            req.flash('flashBody', thirdParty);

            res.redirect('/login');

            return endpoint(req, res);
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');

        req.session.user = user;

        logger.debug('세션 저장함. %o', req.session.user);

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        req.login(user, (err) => {
        	if (err) return next(err);

        	res.redirect('/');
        	endpoint(req, res);
        });
    })(req, res, next);
};

const googleCallback = (req, res, next) => {
    passport.authenticate('google', (err, user, thirdParty) => {
        if (err) next(err);

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = 'Third-party needs membership';

            req.flash('flashBody', thirdParty);

            res.redirect('/login');

            return endpoint(req, res);
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');

        req.session.user = user;

        logger.debug('세션 저장함. %o', req.session.user);

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        req.login(user, (err) => {
        	if (err) return next(err);

        	res.redirect('/');
        	endpoint(req, res);
        });
    })(req, res, next);
};

module.exports = {
    loginGET: loginGET, logoutGET: logoutGET,
    facebook: facebook, facebookCallback: facebookCallback,
    github: github, githubCallback: githubCallback,
    google: google, googleCallback: googleCallback
};
