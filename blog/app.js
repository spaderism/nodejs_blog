'use strict';

const appConfig = require('config/app');
const errorHandler = require('lib/errorHandler');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
// const favicon = require('serve-favicon');

const app = express();

// view engine setup
app.set('views', path.join(appConfig.NODE_PATH, 'view'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(require('stylus').middleware(path.join(appConfig.NODE_PATH, 'public')));
app.use(express.static(path.join(appConfig.NODE_PATH, 'public')));

// passport oauth
app.use(passport.initialize());
app.use(passport.session());
app.use(require('connect-flash')());

require('config/route')(app); // 라우팅
require('config/passport')(app, passport); // 패스포트 설정

// catch 404 and forward to error handler
// error handler
app.use(errorHandler.notFound);
app.use(errorHandler.errorHandler);

module.exports = app;
