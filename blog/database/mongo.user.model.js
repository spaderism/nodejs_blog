'use strict';

const logger = require('lib/logger')('database/mongo.user.model.js');

const findByEmail = (database, email, callback) => {
    logger.debug('findByEmail method 호출됨.');

    const UserModel = database.mongodb.UserModel;
    const conditions = { email: email };
    UserModel.findByConditions(conditions, (err, users) => {
        callback(err, users);
    });
};

const insert = (database, userInfo, callback) => {
    logger.debug('insert method 호출됨.');

    const UserModel = database.mongodb.UserModel;
    new UserModel(userInfo).save((err) => {
        callback(err, true);
    });
};

const comparePassword = (database, loginInfo, userInfo, callback) => {
    logger.debug('comparePassword method 호출됨.');

    const UserModel = database.mongodb.UserModel;
    const user = new UserModel({ email: loginInfo.email });
    const authenticated = user.authenticate(
        loginInfo.password, userInfo._doc.salt, userInfo._doc.hashed_password
    );

    if (authenticated) {
        logger.debug('비밀번호 일치함. %o', userInfo);
        return callback(true);
    } else {
        logger.debug('비밀번호 일치하지 않음. %o', userInfo);
        callback(false);
    }
};

const updateSessionId = (database, email, sessionID, callback) => {
    logger.debug('updateSessionId method 호출됨.');

    const UserModel = database.mongodb.UserModel;
    const conditions = { email: email };
    const update = { $set: { session_id: sessionID } };
    UserModel.update(conditions, update, {}, (err) => {
        callback(err);
    });
};

module.exports = {
    findByEmail: findByEmail, insert: insert,
    comparePassword: comparePassword, updateSessionId: updateSessionId
};
