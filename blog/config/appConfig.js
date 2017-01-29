'use strict';

const privateConfig = require('config/privateConfig');
const appConfig = {

    NODE_PATH: process.env.NODE_PATH,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // * masterKey : 마스터키 - 어드민에서 사용(user signup)
    masterKey: privateConfig.masterKey,

    // * serverPort : 서버 포트
    serverPort: privateConfig.serverPort,

    // * cookieOpts     : 쿠키 옵션
    // * expressSession : express 세션 옵션
    cookie: {
        maxAge: 60 * 60 * 24 * 7
    },
    session: {
        secret: privateConfig.masterKey,
        resave: false, saveUninitialized: true
    },

    // * file   : 라우팅 파일
    // * path   : 클라이언트로부터 받은 요청 패스
    // * method : 라우팅 파일 안에 만들어 놓은 객체의 함수 이름
    // * type   : get or post
    routeInfo: [
        // route/index
        { file: 'control/index/index', path: '/', method: 'index', type: 'get' }
    ],

    // * facebook : facebook 개발자 센터 정보
    // * facebook oauth 로그인시 사용
    oauthSocial: {
        facebook: {
            clientID: privateConfig.oauthSocial.facebook.clientID,
            clientSecret: privateConfig.oauthSocial.facebook.clientSecret,
            callbackURL: privateConfig.oauthSocial.facebook.callbackURL
        },
        github: {
            clientID: privateConfig.oauthSocial.github.clientID,
            clientSecret: privateConfig.oauthSocial.github.clientSecret,
            callbackURL: privateConfig.oauthSocial.github.callbackURL
        },
        google: {
            clientID: privateConfig.oauthSocial.google.clientID,
            clientSecret: privateConfig.oauthSocial.google.clientSecret,
            callbackURL: privateConfig.oauthSocial.google.callbackURL
        }
    },

    database: {
        // * mongodb : 몽고 DB
        mongodb: {
            url: privateConfig.database.mongodb.url,
            schemas: [
                { file: 'database/mongo/userSchema', collection: 'users', schemaName: 'UserSchema', modelName: 'UserModel' }
            ]
        },
        redis: {
            host: '127.0.0.1',
            port: 6379,
            db: 0
        }
    },

    logFilePath: {
        server: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/server',
        history: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/history'
    }
};

module.exports = appConfig;
