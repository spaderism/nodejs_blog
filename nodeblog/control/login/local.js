'use strict';

const logger = require('lib/logger')('control:login:local');
const LocalStrategy = require('passport-local').Strategy;
const constant = require('config/constant');

// 로그인 페이지 요청
const loginGET = (req, res) => {
    logger.debug('loginGET method 호출됨');
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
    database.UserModel.findOne({ 'email' :  email }, (err, user) => {
        if (err) { return done(err); }

        // 등록된 사용자가 없는 경우
        if (!user) {
            logger.debug('계정이 일치하지 않음.');
            return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
        }

        // 비밀번호 비교하여 맞지 않는 경우
        const authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
        if (!authenticated) {
            logger.debug('비밀번호 일치하지 않음.');
            return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
        }

        // 정상인 경우
        logger.debug('계정과 비밀번호가 일치함.');
        return done(null, user);
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

    let userInfo = {
        provider: req.body.provider,
        email: email,
        password: password,
        name: req.body.name,
        masterKey: req.body.master_key
    };

    // if (!retEssential.isValid) {
    //     return res.status(constant.httpStatusCode.BAD_REQUST)
    //               .json(retEssential.message);
    // }

    // const paramName = req.param('name');
    // logger.debug('signupPOST method 호출됨');

    // process.nextTick(() => {
    //     const database = req.app.get('database');
    //     database.UserModel.findOne({ 'email' :  email }, (err, user) => {
    //         // 에러 발생 시
    //         if (err) {
    //             return done(err);
    //         }

    //         // 기존에 이메일이 있는 경우
    //         if (user) {
    //             logger.debug('기존에 계정이 있음.');
    //             return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
    //         } else {
    //             // 모델 인스턴스 객체 만들어 저장
    //             const user = new database.UserModel({'email':email, 'password':password, 'name':paramName});
    //             user.save((err) => {
    //                 if (err) {
    //                     throw err;
    //                 }

    //                 logger.debug("사용자 데이터 추가함.");
    //                 return done(null, user);
    //             });
    //         }
    //     });
    // });
});

module.exports = {
    loginGET: loginGET, loginPOST: loginPOST,
    signupGET: signupGET, signupPOST: signupPOST
};

