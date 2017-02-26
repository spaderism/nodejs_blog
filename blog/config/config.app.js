'use strict';

const privateConfig = require('config/config.private');

const NODE_PATH = process.env.NODE_PATH;
const NODE_ENV = process.env.NODE_ENV || 'development';

const appConfig = {

    NODE_PATH: NODE_PATH, NODE_ENV: NODE_ENV,

    // masterKey : 마스터키 - 어드민에서 사용(user signup)
    masterKey: privateConfig.masterKey,

    serverPort: privateConfig.serverPort[NODE_ENV], testServerPort: 9999,

    // cookie  : 쿠키 옵션
    // session : express 세션 옵션
    cookie: {
        maxAge: 60 * 60 * 24 * 7
    },
    session: {
        secret: privateConfig.masterKey,
        resave: false, saveUninitialized: true
    },

    // file   : 라우팅 파일
    // path   : 클라이언트로부터 받은 요청 패스
    // method : 라우팅 파일 안에 만들어 놓은 객체의 함수 이름
    // type   : get or post
    routeInfo: [
        // index
        { file: 'control/index', path: '/', method: 'indexGET', type: 'get' },
        // login
        { file: 'control/login', path: '/login', method: 'loginGET', type: 'get' },
        { file: 'control/api.login', path: '/api/login', method: 'loginPOST', type: 'post' },
        // user
        { file: 'control/api.user', path: '/api/user', method: 'userPOST', type: 'post' },
        { file: 'control/api.user', path: '/api/user', method: 'userDELETE', type: 'delete' },
        // logout
        { file: 'control/login', path: '/logout', method: 'logoutGET', type: 'get'},
        // facebook
        { file: 'control/login', path: '/facebook', method: 'facebook', type: 'get' },
        { file: 'control/login', path: '/facebook-callback', method: 'facebookCallback', type: 'get' }
    ],

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
        mongodb: {
            url: privateConfig.database.mongodb.url[NODE_ENV],
            schemas: [
                { file: 'database/mongo/userSchema', collection: 'users', schemaName: 'UserSchema', modelName: 'UserModel' }
            ]
        },
        redis: {
            host: privateConfig.database.redis.host,
            port: privateConfig.database.redis.port,
            db: privateConfig.database.redis.db[NODE_ENV]
        }
    },

    logFilePath: {
        server: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/server',
        history: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/history'
    }
};

module.exports = appConfig;
