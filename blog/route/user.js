'use strict';

const moment = require('moment');
const async = require('async');
const config = require('config/config');
const userDBA = require('database/mongo/user');
const logger = require('lib/logger')('route:user');

const loginGET = (req, res) => {
    logger.debug('Request get admin page');
    res.render('login', { loginMode: 'local' });
};

const loginPOST = (req, res) => {
    logger.debug('user 모듈안에 있는 login 호출됨.');

    const loginInfo = {
        email: req.body.email,
        password: req.body.password
    };

    const validRes = badValidation(loginInfo);
    if (validRes.isBad) return res.status(400).json(
        { success: false, message: validRes.message }
    );

    const database = req.app.get('database');
    async.waterfall([
        (callback) => {
            userDBA.findByEmail(database, loginInfo.email, (err, users) => {
                if (err) { return callback(err); }
                logger.debug('아이디 [%s]로 사용자 검색결괴 : %o', loginInfo.email, users);
                callback(null, users);
            });
        },
        (users, callback) => {
            if (!users) {
                logger.debug('아이디와 일치하는 사용자를 찾지 못함.');
                return callback(null, null);
            }

            logger.debug('아이디와 일치하는 사용자 찾음.');
            const user = users[0];
            userDBA.comparePassword(database, loginInfo, user, (isEqual) => {
                if (isEqual) {
                    return callback(null, user);
                }
                callback(null, false);
            });
        },
        (user, callback) => {
            if (!user) return callback(null, false);

            req.session.user = {
                email: user.email,
                name: user.name,
                created: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
                updated: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss')
            };

            /**
             * 세션 아이디!! db에 저장해야함!!
             */
            logger.debug('세션 저장함. %o', req.session.user);

            if (!req.body.useCookie) return callback(null, true);
            userDBA.updateSessionId(database, user.email, req.sessionID, (err) => {
                if (err) { return callback(err); }

                res.cookie('user', req.sessionID, config.cookieOption);
                logger.debug('쿠키 저장함. %s', req.sessionID);

                callback(null, true);
            });
        }
    ], (err, result) => {
        if (err) { throw err; }
        if (result) {
            logger.debug('로그인 성공.');
            res.status(200).json(
                { success: true, message: null }
            );
        } else {
            logger.debug('로그인 실패.');
            res.status(200).json(
                { success: false, message: 'Login fail.\nCheck email or password.' }
            );
        }
    });
};

const signup = (req, res) => {
    logger.debug('user 모듈 안에 있는 signup 호출됨.');

    const userInfo = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    };

    if (config.masterKey !== req.body.master_key) {
        const message = `Master key(${req.body.master_key}) is not Equal`;
        logger.debug(message);
        return res.status(403).json(
            { success: false, message: message }
        );
    }

    const validRes = badValidation(userInfo);
    if (validRes.isBad) return res.status(400).json(
        { success: false, message: validRes.message }
    );

    const database = req.app.get('database');
    async.waterfall([
        (callback) => {
            logger.debug('이메일 중복체크.');
            userDBA.findByEmail(database, userInfo.email, (err, users) => {
                if (err) { return callback(err); }
                if (!users[0]) { callback(null, false); }
                else { callback(null, true); }
            });
        },
        (isDuplicated, callback) => {
            if (!isDuplicated) {
                userDBA.insert(database, userInfo, (err) => {
                    if (err) { return callback(err); }
                    logger.debug('사용자 데이터 추가함.');
                    callback(null, true);
                });
            } else {
                logger.debug('이메일 중복됨. 사용자 데이터 추가 안함.');
                callback(null, false);
            }
        }
    ], (err, result) => {
        if (err) { throw err; }
        if (result) {
            return res.status(200).json(
                { success: true, message: null }
            );
        } else {
            return res.status(200).json(
                { sucess: false, message: 'Email duplicated' }
            );
        }
    });
};

const badValidation = (infoObj) => {
    let isBad = false;
    let message = '';

    for (const key of Object.keys(infoObj)) {
        const value = infoObj[key];

        if (!value) {
            isBad = true;
            message = `${key} is not string or required`;
            logger.debug(message);
        }

        const regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if (key === 'email' && !regexEmail.test(value)) {
            isBad = true;
            message = `Email regex error ${value}`;
            logger.debug(message);
        }
    }

    return { isBad: isBad, message: message };
};

module.exports = {
    loginGET: loginGET,
    loginPOST: loginPOST,
    signup: signup
};
