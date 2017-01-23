'use strict';

const uuid = require('uuid');
const clone = require('clone');
const moment = require('moment');
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
const logSaver = require('lib/logSaver');
const appSpec = require('config/appSpec');
const constant = require('config/constant');
const appConfig = require('config/appConfig');

module.exports = (req, res, resData, error) => {
	resData = reformResData(req, resData, error);
	resJson(res, clone(resData));
	if ((Object.keys(appSpec.paths)).includes(req.url)) {
		logSaver(req, res, resData);
	}
};

const reformResData = (req, resData, error) => {
	resData.meta.code = resData.meta.code || constant.statusMessages.UNKNOWN_ERROR;
	resData.meta.message = resData.meta.message || constant.statusMessages[resData.meta.code];
	resData.meta.trace_id = (uuid.v4()).replace(/-/gi, '');
	resData.response = resData.response || {};

	const method = req.method;
	const logtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	const debugLog = {};
	debugLog.title = 'REQUEST LOG';
	debugLog.datetime = logtime;
	debugLog.log_path = `${appConfig.logFilePath.history}${getSubPath(req, logtime)}`;
	debugLog.log = { url: {}, headers: {} };

	debugLog.log.url.method = `${req.method}:${req.url}`;
	debugLog.log.url.protocol = req.protocol ? req.protocol : 'http';
	debugLog.log.url.hostname = (req.headers.host).split(':')[0] || '';
	debugLog.log.url.port = (req.headers.host).split(':')[1] || '';
	debugLog.log.url.fulltext = `${debugLog.log.url.protocol}://${debugLog.log.url.hostname}${req.url}`;

	debugLog.log.headers = req.headers;
	if (method === 'GET') debugLog.log.query = req.query || {};
	if (method === 'POST') debugLog.log.body = req.body || {};

	debugLog.log.client_ip = req.headers['x-forwarded-for'] || 'development';
	bcryptDebug(debugLog.log.query || debugLog.log.body || {});

	resData.debug = debugLog;

	if (error) resData.debug.log.error = error;

	return resData;
};

const getSubPath = (req, logtime) => {
	const datetimes = logtime.split(' ')[0].split('-');
	return handlebars.compile('{{url}}/{{year}}/{{month}}/{{day}}')({
		url: req.url || 'blank', year: datetimes[0] || 'blank',
		month: datetimes[1] || 'blank', day: datetimes[2] || 'blank'
	});
};

const bcryptDebug = (reqData) => {
	const bcryptField = [ 'password', 'confirmPassword', 'name', 'master_key' ];

	for (const key of Object.keys(reqData)) {
		const value = reqData[key];

		if (typeof value === 'object') {
			bcryptDebug(value);
		}
		if (typeof value === 'string') {
			reqData[key] = !bcryptField.includes(key) ? value
				  		 : bcrypt.hashSync(value, bcrypt.genSaltSync(10));
		}
	}
};

const resJson = (res, cloneResData) => {
	const devIp = [ 'development', '127.0.0.1', '39.124.255.241' ];
	const clientIp = cloneResData.debug.log.client_ip;
	if (!devIp.includes(clientIp)) delete cloneResData.debug;

	res.status(cloneResData.meta.code).json(cloneResData);
};
