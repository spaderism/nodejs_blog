'use strict';

const privateConfig = require('config/private');

const NODE_PATH = process.env.NODE_PATH;
const NODE_ENV = process.env.NODE_ENV || 'development';

const appConfig = {

    NODE_PATH: NODE_PATH, NODE_ENV: NODE_ENV,

    // masterKey : 마스터키 - 어드민에서 사용(user signup)
    masterKey: privateConfig.masterKey,

    serverPort: privateConfig.serverPort[NODE_ENV], testServerPort: 9999,

    crypto: privateConfig.crypto,

    // session : 세션 옵션
    session: {
        secret: privateConfig.masterKey,
        resave: true, saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 * 24 * 7 }
    },

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
                { file: 'database/mongo.user.schema', collection: 'users', schemaName: 'UserSchema', modelName: 'UserModel' }
            ]
        },
        redis: {
            host: privateConfig.database.redis.host,
            port: privateConfig.database.redis.port,
            db: privateConfig.database.redis.db[NODE_ENV]
        },
        mysql: {
            host: privateConfig.database.mysql.host,
            port: privateConfig.database.mysql.port,
            user: privateConfig.database.mysql.user,
            password: privateConfig.database.mysql.password,
            database: privateConfig.database.mysql.database[NODE_ENV],
            connectionLimit: 10,
            waitForConnections: true
        }
    },

    board: {
        pageNationUnit: 5,
        howmanyPerPage: 5,
        category: [ 'javascript', 'node.js', 'java', 'php', 'database', 'linux', 'etc' ]
    },

    logFilePath: {
        server: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/server',
        history: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/log/history'
    },

    uploadPath: '/Users/MacintoshHD/Documents/git/nodejs_blog/blog/public/image/upload'
};

module.exports = appConfig;
