'use strict';

const uuid = require('uuid');
const clone = require('clone');
const moment = require('moment');
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');
const logSaver = require('lib/logSaver');
const constant = require('config/constant');
const appConfig = require('config/config.app');

module.exports = (req, res, data, error) => {
	data = reformData(req, data, error);

	if (req.url.startsWith('/api')) {
		resJson(res, clone(data));
	}

	if (!error || (error && error.errMessage !== constant.statusMessages[constant.statusCodes.NOT_FOUND])) {
		logSaver(req, res, data);
	}
};

const reformData = (req, data, error) => {
	const traceId = uuid.v4().replace(/-/gi, '');

	if (data) {
		data.meta.code = data.meta.code || constant.statusMessages.UNKNOWN_ERROR;
		data.meta.message = data.meta.message || constant.statusMessages[data.meta.code];
		data.meta.trace_id = traceId;
		data.response = data.response || {};
	} else {
		data = {};
	}

	const method = req.method;
	const logtime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

	const debugLog = {};
	debugLog.title = 'REQUEST LOG';
	debugLog.trace_id = traceId;
	debugLog.client_ip = req.headers['x-forwarded-for'] || 'development';
	debugLog.datetime = logtime;

	debugLog.url = {};
	debugLog.url.method = `${req.method}:${req.url}`;
	debugLog.url.protocol = req.protocol ? req.protocol : 'http';
	debugLog.url.hostname = (req.headers.host).split(':')[0] || '';
	debugLog.url.port = (req.headers.host).split(':')[1] || '';
	debugLog.url.fulltext = `${debugLog.url.protocol}://${debugLog.url.hostname}${req.url}`;

	debugLog.headers = req.headers;

	debugLog.log_path = `${appConfig.logFilePath.history}${getSubPath(req, logtime)}`;

	if (method === 'GET') {
		debugLog.query = req.query || {};
	} else {
		debugLog.body = req.body || {};
	}

	bcryptDebug(debugLog.query || debugLog.body || {});

	data.debug = debugLog;

	data.debug.error = error ? true : false;

	if (error) {
		data.debug.error = error;
	}

	return data;
};

const getSubPath = (req, logtime) => {
	const datetimes = logtime.split(' ')[0].split('-');
	const url = req.method === 'GET' ? req.url.split('?')[0] : req.url;

	return handlebars.compile('{{url}}/{{year}}/{{month}}/{{day}}')({
		url: url === '/' ? '/index' : url || 'blank',
		year: datetimes[0] || 'blank',
		month: datetimes[1] || 'blank',
		day: datetimes[2] || 'blank'
	});
};

const bcryptDebug = (reqData) => {
	const bcryptField = [
		'name', 'first_name', 'last_name',
		'password', 'confirm_password', 'master_key'
	];

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

const resJson = (res, cloneData) => {
	const devIp = [ 'development', '127.0.0.1', '39.124.255.241' ];
	const clientIp = cloneData.debug.client_ip;
	if (!devIp.includes(clientIp)) delete cloneData.debug;

	res.status(cloneData.meta.code).json(cloneData);
};
