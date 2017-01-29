'use strict';

const LocalStrategy = require('passport-local').Strategy;
const logger = require('lib/logger')('control:login:local');
const appConfig = require('config/appConfig');
const constant = require('config/constant');
const responsor = require('lib/responsor');
const logSaver = require('lib/logSaver');

const async = require('async');
const clone = require('clone');
const moment = require('moment');

// 로그인 페이지 요청
const loginGET = (req, res) => {
    logger.debug('loginGET method 호출됨');

    const meta = {};
    meta.code = constant.statusCodes.SUCCESS;
    meta.message = constant.statusMessages[meta.code];

    responsor(req, res, { meta: meta });

    res.render('login', { provider: 'local' });
};

// 로그인 요청
const loginPOST = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, done) => {
    logger.debug('loginPOST method 호출됨');

    const database = req.app.get('database');
    database.mongodb.UserModel.findOne({ email :  email }, (err, user) => {
        if (err) { return done(err); }

        // 등록된 사용자가 없는 경우
        if (!user) {
            logger.debug('계정이 일치하지 않음.');
            return done(null, false, req.flash('message', 'Account is not exists'));
        }

        // 비밀번호 비교하여 맞지 않는 경우
        const authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if (!authenticated) {
            logger.debug('비밀번호 일치하지 않음.');
            return done(null, false, req.flash('message', 'Wrong passpord'));
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');

        req.session.user = {
            email: user.email,
            name: user.name,
            created: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
            updated: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')
        };

        logger.debug('세션 저장함. %o', req.session.user);

        done(null, clone(req.session.user));
    });
});

// 회원가입 폼 링크
const signupGET = (req, res) => {
    logger.debug('/signup 패스 요청됨.');
    res.render('signup.ejs', { message: req.flash('signupMessage') });
};

// 회원가입
const signupPOST = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, done) => {
    logger.debug('signupPOST method 호출됨');

    if (req.body.master_key !== appConfig.masterKey) {
        return done(null, false, req.flash('message', `Master Key is not correct`));
    }

    process.nextTick(() => {
        const database = req.app.get('database');

        async.series([
            (callback) => {
                database.mongodb.UserModel.findOne({ email: email }, (err, user) => {
                    callback(err, user);
                });
            }
        ], (err, user) => {
            if (err) return done(err);
            if (user[0]) {
                logger.debug('기존에 계정이 있음.');
                return done(null, false, req.flash('message', 'Account already exists'));
            }

            // 모델 인스턴스 객체 만들어 저장
            user = new database.mongodb.UserModel({
                email: email, password: password,
                name: req.body.name, provider: req.body.provider
            });
            user.save((err) => {
                if (err) done(err);

                logger.debug("사용자 데이터 추가함.");

                return done(null, user);
            });
        });
    });
});

module.exports = {
    loginGET: loginGET, loginPOST: loginPOST,
    signupGET: signupGET, signupPOST: signupPOST
};
