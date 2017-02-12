'use strict';

const async = require('async');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('lib/logger')('control:login:local');

// 회원가입
const signupPOST = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, (req, email, password, next) => {
    logger.debug('signupPOST method 호출됨');

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

const deletePOST = (req, res, next) => {

};

module.exports = {
    signupPOST: signupPOST, deletePOST: deletePOST
};
