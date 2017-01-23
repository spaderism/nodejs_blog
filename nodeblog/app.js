'use strict';

const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const path = require('path');
const app = express();

const appConfig = require('config/appConfig');

// view engine setup
app.set('views', path.join(appConfig.NODE_PATH, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cookie, session
app.use(cookieParser());
app.use(expressSession(appConfig.expressSession));

// public
app.use(require('stylus').middleware(path.join(appConfig.NODE_PATH, 'public')));
app.use(express.static(path.join(appConfig.NODE_PATH, 'public')));

// passport oauth
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());

// middleware
app.use(require('middleware/preprocess'));
app.use(require('middleware/auth'));
app.use(require('middleware/login'));

require('routes/routeLoader')(app); // 라우팅
require('config/passport')(app, passport); // 패스포트 설정
require('routes/routePassport')(app, passport); // 패스포트 관련 라우팅

// catch 404 and forward to error handler
// error handler
app.use(require('lib/error/errorHandler').notFound);
app.use(require('lib/error/errorHandler').errorHandler);

module.exports = app;
