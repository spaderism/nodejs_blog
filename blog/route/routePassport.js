'use strict';

const contLocal = require('control/login/local');
const logger = require('lib/logger')('route:routePassport');
const constant = require('config/constant');
const responsor = require('lib/responsor');
const appConfig = require('config/appConfig');

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

    app.get('/login', contLocal.loginGET);
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

    // 패스포트 - 로컬 로그인 ajax endpoint
    app.post('/login', (req, res, done) => {
        passport.authenticate('local-login', (err, user, message) => {
            if (err) done(err);

            const meta = {};

            if (!user) {
                meta.code = constant.statusCodes.BAD_REQUEST,
                meta.message = req.flash('message')[0];

                return responsor(req, res, { meta: meta });
            }

            meta.code = constant.statusCodes.SUCCESS;
            meta.message = constant.statusMessages[meta.code];

            if (!req.body.useCookie) return responsor(req, res, {
                meta: meta, response: [ user ]
            });

            const database = req.app.get('database');
            database.mongodb.UserModel.findByEmailAndUpdate(req.body.email, { $set: { session_id: req.sessionID } }, (err) => {
                if (err) done(err);
                res.cookie('user', req.sessionID, appConfig.cookie);
                logger.debug('쿠키 저장함. %s', req.sessionID);
                responsor(req, res, { meta: meta, response: [ user ] });
            });
        })(req, res, done);
    });

    // 패스포트 - 로컬 회원가입 ajax endpoint
    app.post('/signup', (req, res, done) => {
        passport.authenticate('local-signup', (err, user, message) => {
            if (err) done(err);

            const meta = {};

            if (!user) {
                meta.code = constant.statusCodes.BAD_REQUEST;
                meta.message = req.flash('message')[0];

                return responsor(req, res, { meta: meta });
            }

            meta.code = constant.statusCodes.SUCCESS;
            meta.message = constant.statusMessages[meta.code];

            responsor(req, res, { meta: meta, response: [req.body] });
        })(req, res, done);
    });

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
