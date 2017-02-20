'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const mkdirp = require('mkdirp');
const prettyjson = require('prettyjson');
const logger = require('lib/logger')('lib:logSaver');

module.exports = (req, res, data) => {
	toFile(req, res, data);
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
