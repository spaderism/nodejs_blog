'use strict';

const appConfig = require('config/app');
const errorHandler = require('lib/errorHandler');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const Redis = require('ioredis');
const redisClient = new Redis(appConfig.database.redis);
const passport = require('passport');
// const favicon = require('serve-favicon');

const app = express();

// view engine setup
app.set('views', path.join(appConfig.NODE_PATH, 'view'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.get('/favicon.ico', (req, res) => {
	res.sendStatus(204);
});

// swagger
app.use('/swagger-ui', express.static(path.join(appConfig.NODE_PATH, 'node_modules/swagger-ui/dist')));
app.use('/swagger.json', (req, res) => { res.json(require('swagger/swagger')); });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(appConfig.NODE_PATH, 'public')));
app.use(express.static(path.join(appConfig.NODE_PATH, 'public')));

// session
app.use(session({
	secret: appConfig.session.secret,
	store: new RedisStore({ client: redisClient }),
	resave: appConfig.session.resave,
	saveUninitialized: appConfig.session.saveUninitialized,
	cookie: appConfig.session.cookie
}));

// passport oauth
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());

// middleware
app.use(require('middleware/validation'));
app.use(require('middleware/auth'));
app.use(require('middleware/login'));

require('config/passport').init(app, passport); // 패스포트 설정
require('config/route').routeLoader(app); // 라우팅

// catch 404 and forward to error handler
// error handler
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

module.exports = app;
