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
    }, (accessToken, refreshToken, profile, done) => {
        logger.debug('passport의 facebook 호출됨.');
        logger.debug(profile);

        //const conditions = { email: profile.emails[0].value };

        const database = app.get('database');
        const UserModel = database.mongodb.UserModel;
        //UserModel.findByConditions()
        //UserModel.load(options, function (err, user) {
        //    if (err) return done(err);
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
        //            return done(err, user);
        //        });
        //    } else {
        //        return done(err, user);
        //    }
        //});
    });
};

const github = (app, passport) => {
    return new (require('passport-facebook').Strategy)({
        clientID: appConfig.oauthSocial.facebook.clientID,
        clientSecret: appConfig.oauthSocial.facebook.clientSecret,
        callbackURL: appConfig.oauthSocial.facebook.callbackURL,
        _passReqToCallback: true,
        profileFields: [ 'id', 'emails', 'name' ]
    }, (accessToken, refreshToken, profile, done) => {
        logger.debug('passport의 facebook 호출됨.');
        logger.debug(profile);

        //const conditions = { email: profile.emails[0].value };

        const database = app.get('database');
        const UserModel = database.mongodb.UserModel;
        //UserModel.findByConditions()
        //UserModel.load(options, function (err, user) {
        //    if (err) return done(err);
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
        //            return done(err, user);
        //        });
        //    } else {
        //        return done(err, user);
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
    }, (accessToken, refreshToken, profile, done) => {
        logger.debug('passport의 facebook 호출됨.');
        logger.debug(profile);

        //const conditions = { email: profile.emails[0].value };

        const database = app.get('database');
        const UserModel = database.mongodb.UserModel;
        //UserModel.findByConditions()
        //UserModel.load(options, function (err, user) {
        //    if (err) return done(err);
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
        //            return done(err, user);
        //        });
        //    } else {
        //        return done(err, user);
        //    }
        //});
    });
};

module.exports = { facebook: facebook, github: github, google: google };
