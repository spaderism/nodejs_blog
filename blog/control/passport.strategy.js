'use strict';

const clone = require('clone');
const async = require('async');
const appConfig = require('config/config.app');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('lib/logger')('control:passport:strategy');

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
});

// 회원가입
const userPOST = new LocalStrategy({
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
});

const facebook = (app, passport) => {
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
                    thirdParty: profile._json
                });
            }

            next(null, { email: profile._json.email, name: user.name });
        });
    });
};

const github = (app, passport) => {
    return new (require('passport-facebook').Strategy)({
        clientID: appConfig.oauthSocial.facebook.clientID,
        clientSecret: appConfig.oauthSocial.facebook.clientSecret,
        callbackURL: appConfig.oauthSocial.facebook.callbackURL,
        _passReqToCallback: true,
        profileFields: [ 'id', 'emails', 'name' ]
    }, (accessToken, refreshToken, profile, next) => {
        logger.debug('passport의 facebook 호출됨.');
        logger.debug(profile);

        //const conditions = { email: profile.emails[0].value };

        const database = app.get('database');
        const UserModel = database.mongodb.UserModel;
        //UserModel.findByConditions()
        //UserModel.load(options, function (err, user) {
        //    if (err) return next(err);
        //
        //    if (!user) {
        //        const user = new UserModel({
        //            name: profile.displayName,
        //            email: profile.emails[0].value,
        //            provider: 'facebook',
        //            authToken: accessToken,
        //            facebook: profile._json
        //        });
        //
        //        user.save(function (err) {
        //            if (err) console.log(err);
        //            return next(err, user);
        //        });
        //    } else {
        //        return next(err, user);
        //    }
        //});
    });
};

const google = (app, passport) => {
    return new (require('passport-facebook').Strategy)({
        clientID: appConfig.oauthSocial.facebook.clientID,
        clientSecret: appConfig.oauthSocial.facebook.clientSecret,
        callbackURL: appConfig.oauthSocial.facebook.callbackURL,
        _passReqToCallback: true,
        profileFields: [ 'id', 'emails', 'name' ]
    }, (accessToken, refreshToken, profile, next) => {
        logger.debug('passport의 facebook 호출됨.');
        logger.debug(profile);

        //const conditions = { email: profile.emails[0].value };

        const database = app.get('database');
        const UserModel = database.mongodb.UserModel;
        //UserModel.findByConditions()
        //UserModel.load(options, function (err, user) {
        //    if (err) return next(err);
        //
        //    if (!user) {
        //        const user = new UserModel({
        //            name: profile.displayName,
        //            email: profile.emails[0].value,
        //            provider: 'facebook',
        //            authToken: accessToken,
        //            facebook: profile._json
        //        });
        //
        //        user.save(function (err) {
        //            if (err) console.log(err);
        //            return next(err, user);
        //        });
        //    } else {
        //        return next(err, user);
        //    }
        //});
    });
};

module.exports = {
    userPOST: userPOST, loginPOST: loginPOST,
    facebook: facebook, github: github, google: google
};
