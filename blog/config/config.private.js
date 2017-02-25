'use strict';

module.exports = {
	masterKey: 'TjdnfTnstn#lqkrEkfskan!',
	serverPort: {
        development: 3002, stage: 3001, production: 3000
    },

	oauthSocial: {
        facebook: {
            clientID: '1847758275482762',
            clientSecret: '274a1cd220b6b9dd75e7f3b0e4102d58',
            callbackURL: '/facebook-callback'
        },
        github: {
            clientID: '',
            clientSecret: '',
            callbackURL: ''
        },
        google: {
            clientID: '',
            clientSecret: '',
            callbackURL: ''
        }
    },

    database: {
        mongodb: {
            url: {
                development: 'mongodb://localhost:27017/nodejs_blog_development',
                stage: 'mongodb://localhost:27017/nodejs_blog_stage',
                production: 'mongodb://localhost:27017/nodejs_blog_production'
            }
        },

        redis: {
            host: '127.0.0.1',
            port: 6379,
            db: {
                development: 2, stage: 1, production: 0
            }
        }
    }
};
