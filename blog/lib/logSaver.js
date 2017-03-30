'use strict';

const Crypto = require('lib/Crypto');
const logger = require('lib/logger')('lib/logSaver.js');
const appConfig = require('config/app');
const prettyjson = require('prettyjson');
const mkdirp = require('mkdirp');
const async = require('async');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, data) => {
	encryptData(req, res, data);
	toFile(req, res, data);
};

const encryptData = (req, res, data) => {
	const encryptField = [
		'name', 'first_name', 'last_name',
		'password', 'confirm_password', 'master_key'
	];

	for (const key of Object.keys(data)) {
		const value = data[key];

		if (typeof value === 'object') {
			encryptData(req, res, value);
		}
		if (typeof value === 'string') {
			data[key] = !encryptField.includes(key) ? value :
				Crypto.tripledesEncrypt(
					data[key], appConfig.crypto.key, appConfig.crypto.iv
				);
		}
	}
};

const toFile = (req, res, data) => {
	const directory = data.debug.log_path;
	const filename = `${directory}/${data.debug.trace_id}.log`;

	async.series([
		(callback) => {
			mkdirp(directory, (err) => {
				callback(err);
			});
		},
		(callback) => {
			data = prettyjson.render(data, { noColor: true });
			fs.writeFile(filename, data, 'utf8', (err) => {
				callback(err);
			});
		}
	], (err) => {
		if (err) return logger.error(err);
		logger.debug(`success to save log ${filename.replace(/\//g, path.sep)}`);
	});
};
