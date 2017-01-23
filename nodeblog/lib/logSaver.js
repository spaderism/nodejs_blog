'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const mkdirp = require('mkdirp');
const prettyjson = require('prettyjson');
const logger = require('lib/logger')('lib:logSaver');

module.exports = (req, res, resData) => {
	toFile(req, res, resData);
};

const toFile = (req, res, resData) => {
	const directory = resData.debug.log_path;
	const filename = `${directory}/${resData.meta.trace_id}.log`;

	async.series([
		(callback) => {
			mkdirp(directory, (err) => {
				callback(err);
			});
		},
		(callback) => {
			resData = prettyjson.render(resData, { noColor: true });
			fs.writeFile(filename, resData, 'utf8', (err) => {
				callback(err);
			});
		}
	], (err) => {
		if (err) return logger.error(err);
		logger.debug(`success to save log ${directory.replace(/\//g, path.sep)}`);
	});
};
