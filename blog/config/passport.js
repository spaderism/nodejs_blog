'use strict';

const localCont = require('control/login.local');
const userCont = require('control/user.user');
const socialCont = require('control/login.social');
const logger = require('lib/logger')('config:passport');

module.exports = (app, passport) => {
    logger.debug('config/passport 호출됨.');

    // 사용자 인증 성공 시 호출
    passport.serializeUser((user, next) => {
        logger.debug('serializeUser() 호출됨.');
        logger.debug(user);

        next(null, user);
    });

    // 사용자 인증 이후 사용자 요청 시마다 호출
    passport.deserializeUser((user, next) => {
        logger.debug('deserializeUser() 호출됨.');
        logger.debug(user);

        // 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
        next(null, user);
    });

    // 인증방식 설정
    passport.use('login', localCont.loginPOST);
    passport.use('signup', userCont.signupPOST);
    passport.use('facebook', socialCont.facebook(app, passport));
    passport.use('github', socialCont.github(app, passport));
    passport.use('google', socialCont.google(app, passport));

    logger.debug('5가지 passport 인증방식 설정됨.');
};
