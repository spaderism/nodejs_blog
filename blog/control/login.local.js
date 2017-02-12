'use strict';

const clone = require('clone');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('lib/logger')('control:login:local');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');

// 로그인 페이지 요청
const loginGET = (req, res, next) => {
    logger.debug('loginGET method 호출됨');

    let data = null;
    const flashBody = req.flash('flashBody');

    if (flashBody.length) {
        data = flashBody[0];
    } else {
        const meta = {};
        const response = {};

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        response.provider = 'local';

        data = { meta: meta, response: response };
    }

    res.render('login', data.response);
    endpoint(req, res, data);
};

// 로그인 요청
const loginPOST = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, next) => {
    logger.debug('loginPOST method 호출됨');

    const database = req.app.get('database');
    const conditions = { email :  email, provider: 'local' };

    database.mongodb.UserModel.findOne(conditions, (err, user) => {
        if (err) throw err;

        // 등록된 사용자가 없는 경우
        if (!user) {
            logger.debug('계정이 일치하지 않음.');
            return next(null, false, req.flash('message', 'Account is not exists'));
        }

        // 비밀번호 비교하여 맞지 않는 경우
        const authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if (!authenticated) {
            logger.debug('비밀번호 일치하지 않음.');
            return next(null, false, req.flash('message', 'Wrong passpord'));
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');

        req.session.user = { email: user.email, name: user.name };

        logger.debug('세션 저장함. %o', req.session.user);

        next(null, clone(req.session.user));
    });
});

// 로그아웃
const logoutGET = (req, res, next) => {
    logger.debug('logoutGET method 호출됨');
    req.logout();
    delete req.session.user;
    res.redirect('/login');
};

module.exports = {
    loginGET: loginGET, loginPOST: loginPOST, logoutGET: logoutGET
};
