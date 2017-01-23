'use strict';

const contLocal = require('control/login/local');
const logger = require('lib/logger')('route:routePassport');

module.exports = (app, passport) => {

    // 홈 화면 - 로그인 링크
    //app.get('/', (req, res) => {
    //    logger.debug('/ 패스 요청됨.');
    //    logger.debug(req.user);
    //
    //    if (!req.user) {
    //        res.render('index.ejs', { login_success:false });
    //    } else {
    //        res.render('index.ejs', { login_success:true });
    //    }
    //});

    //로그인 폼 링크
    app.get('/login', contLocal.loginGET);

    // 회원가입 폼 링크
    app.get('/signup', contLocal.signupGET);

    // 프로필
    app.get('/profile', function(req, res) {
        if (!req.isAuthenticated()) {
            res.redirect('/');
        } else {
            logger.debug('/profile 패스 요청됨.');
            logger.debug(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', { user: req.user[0]._doc });
            } else {
                res.render('profile.ejs', { user: req.user });
            }
        }
    });

    // 로그아웃
    app.get('/logout', (req, res) => {
        logger.debug('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });


    // 패스포트 - 로컬 로그인 라우팅
    app.post('/login',
        passport.authenticate('local-login', {
            successRedirect : '/profile',
            failureRedirect : '/login',
            failureFlash : true
        })
    );

    // 패스포트 - 로컬 회원가입 라우팅
    app.post('/signup',
        passport.authenticate('local-signup', {
            successRedirect : '/profile',
            failureRedirect : '/login',
            failureFlash : true
        })
    );

    // 패스포트 - 페이스북 인증 라우팅
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope : 'email'
        })
    );

    // 패스포트 - 페이스북 인증 콜백 라우팅
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })
    );

};
