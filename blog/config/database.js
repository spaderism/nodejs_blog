'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const logger = require('lib/logger')('config/database.js');
const appConfig = require('config/app');
const mysql = require('mysql');

// database 객체에 db, schema, model 모두 추가
const database = {};

database.init = (app, callback) => {
    logger.debug('init() 호출됨.');
    connect(app, callback);
};

//데이터베이스에 연결하고 응답 객체의 속성으로 db 객체 추가
const connect = (app, callback) => {
    logger.debug('connect() 호출됨.');

    // 데이터베이스 연결 : appConfig의 설정 사용
    mongoose.connect(appConfig.database.mongodb.url);
    database.mongodb = mongoose.connection;
    database.mysqldb = mysql.createPool(appConfig.database.mysql);

    database.mongodb.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.mysqldb.on('error', console.error.bind(console, 'mysql connection error.'));
    database.mongodb.on('open', () => {
        logger.debug(`mongodb에 연결되었습니다. ${appConfig.database.mongodb.url}`);

        // appConfig에 등록된 스키마 및 모델 객체 생성
        createMongoSchema(app);

        callback();
    });
    database.mongodb.on('disconnected', connect);
};

// appConfig에 정의된 스키마 및 모델 객체 생성
const createMongoSchema = (app, callback) => {
    const schemaLen = appConfig.database.mongodb.schemas.length;
    logger.debug(`mongodb설정에 정의된 스키마의 수 : ${schemaLen}`);

    for (let i = 0; i < schemaLen; i++) {
        const curItem = appConfig.database.mongodb.schemas[i];

        // 모듈 파일에서 모듈 불러온 후 createSchema() 함수 호출하기
        const curSchema = require(curItem.file).createSchema(mongoose);
        logger.debug(`mongodb ${curItem.file} 모듈을 불러들인 후 스키마 정의함.`);

        // User 모델 정의
        const curModel = mongoose.model(curItem.collection, curSchema);
        logger.debug(`mongodb ${curItem.collection} 컬렉션을 위해 모델 정의함.`);

        // database mongodb 객체에 속성으로 추가
        database.mongodb[curItem.schemaName] = curSchema;
        database.mongodb[curItem.modelName] = curModel;

        logger.debug(`mongodb 스키마 이름 [${curItem.schemaName}], 모델 이름 [${curItem.modelName}] 이 database mongodb 객체의 속성으로 추가됨.`);
    }
};

module.exports = database;
