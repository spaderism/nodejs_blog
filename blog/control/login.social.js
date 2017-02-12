'use strict';

const appConfig = require('config/appConfig');
const logger = require('lib/logger')('control:login:social');

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

module.exports = { facebook: facebook, github: github, google: google };
