'use strict';

const logger = require('lib/logger')('config/passport.js');
const clone = require('clone');
const async = require('async');
const appConfig = require('config/app');
const LocalStrategy = require('passport-local').Strategy;

const strategy = {
    loginPOST: new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, (req, email, password, next) => {
        logger.debug('loginPOST method 호출됨');

        const database = req.app.get('database');
        const conditions = { email :  email, provider: 'local' };

        database.mongodb.UserModel.findOne(conditions, (err, user) => {
            if (err) return next(err);

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
    }),

    userPOST: new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, (req, email, password, next) => {
        logger.debug('userPOST method 호출됨');

        process.nextTick(() => {
            const database = req.app.get('database');
            const provider = req.body.provider;

            async.series([
                (callback) => {
                    const conditions = { email: email, provider: provider };
                    database.mongodb.UserModel.findOne(conditions, (err, user) => {
                        callback(err, user);
                    });
                }
            ], (err, user) => {
                if (err) return next(err);
                if (user[0]) {
                    logger.debug('기존에 계정이 있음.');
                    return next(null, false, req.flash('message', 'Account already exists'));
                }

                // 모델 인스턴스 객체 만들어 저장
                const model = {
                    email: email, password: password,
                    name: req.body.name, provider: provider,
                };

                if (provider !== 'local') {
                    model[provider] = req.body[provider];
                }

                user = new database.mongodb.UserModel(model);
                user.save((err) => {
                    if (err) next(err);

                    logger.debug('사용자 데이터 추가함.');

                    return next(null, user);
                });
            });
        });
    }),

    facebook: (app, passport) => {
        return new (require('passport-facebook').Strategy)({
            clientID: appConfig.oauthSocial.facebook.clientID,
            clientSecret: appConfig.oauthSocial.facebook.clientSecret,
            callbackURL: appConfig.oauthSocial.facebook.callbackURL,
            _passReqToCallback: true,
            profileFields: [ 'id', 'emails', 'name' ]
        }, (accessToken, refreshToken, profile, next) => {
            logger.debug('passport의 facebook 호출됨.');

            const database = app.get('database');

            const options = { criteria: { 'facebook.id': profile.id } };
            database.mongodb.UserModel.load(options, (err, user) => {
                if (err) return next(err);

                if (!user) {
                    return next(null, null, {
                        name: `${profile._json.last_name}${profile._json.first_name}`,
                        email: profile._json.email,
                        provider: profile.provider,
                        thirdParty: {
                            email: profile._json.email,
                            id: profile._json.id
                        }
                    });
                }

                next(null, { email: profile._json.email, name: user.name });
            });
        });
    },

    github: (app, passport) => {
        return new (require('passport-github').Strategy)({
            clientID: appConfig.oauthSocial.github.clientID,
            clientSecret: appConfig.oauthSocial.github.clientSecret,
            callbackURL: appConfig.oauthSocial.github.callbackURL,
            _passReqToCallback: true,
            profileFields: [ 'id', 'emails', 'name' ]
        }, (accessToken, refreshToken, profile, next) => {
            logger.debug('passport의 github 호출됨.');

            console.log(profile);

            const database = app.get('database');

            const options = { criteria: { 'github.id': profile.id } };
            database.mongodb.UserModel.load(options, (err, user) => {
                if (err) return next(err);

                if (!user) {
                    return next(null, null, {
                        name: profile.username,
                        email: profile._json.email,
                        provider: profile.provider,
                        thirdParty: {
                            email: profile._json.email,
                            id: profile._json.id
                        }
                    });
                }

                next(null, { email: profile._json.email, name: user.name });
            });
        });
    },

    google: (app, passport) => {
        return new (require('passport-google-oauth').OAuth2Strategy)({
            clientID: appConfig.oauthSocial.google.clientID,
            clientSecret: appConfig.oauthSocial.google.clientSecret,
            callbackURL: appConfig.oauthSocial.google.callbackURL,
            _passReqToCallback: true,
            profileFields: [ 'id', 'emails', 'name' ]
        }, (accessToken, refreshToken, profile, next) => {
            logger.debug('passport의 google 호출됨.');

            const database = app.get('database');

            const options = { criteria: { 'google.id': profile.id } };
            database.mongodb.UserModel.load(options, (err, user) => {
                if (err) return next(err);

                if (!user) {
                    return next(null, null, {
                        name: `${profile._json.name.familyName}${profile._json.name.givenName}`,
                        email: profile._json.emails[0].value,
                        provider: profile.provider,
                        thirdParty: {
                            email: profile._json.emails[0].value,
                            id: profile._json.id
                        }
                    });
                }

                next(null, { email: profile._json.email, name: user.name });
            });
        });
    }
};

let passport =  undefined;

module.exports = {
    init: (app, _passport) => {
        logger.debug('config/passport 호출됨.');

        // 사용자 인증 성공 시 호출
        _passport.serializeUser((user, next) => {
            logger.debug('serializeUser() 호출됨.');
            logger.debug(user);

            next(null, user);
        });

        // 사용자 인증 이후 사용자 요청 시마다 호출
        _passport.deserializeUser((user, next) => {
            logger.debug('deserializeUser() 호출됨.');
            logger.debug(user);

            // 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
            next(null, user);
        });

        // 인증방식 설정
        _passport.use('login', strategy.loginPOST);
        _passport.use('signup', strategy.userPOST);
        _passport.use('facebook', strategy.facebook(app, _passport));
        _passport.use('github', strategy.github(app, _passport));
        _passport.use('google', strategy.google(app, _passport));

        logger.debug('5가지 passport 인증방식 설정됨.');

        passport = _passport;
    },

    passport: () => {
        return passport;
    }
};
