'use strict';

const mkdirp = require('mkdirp');
const async = require('async');
const fs = require('fs');

const upload = (file, saveDest, callback) => {
	async.series([
		(callback) => {
			mkdirp(saveDest, (err) => {
				callback(err);
			});
		},
		(callback) => {
			const tempPath = file.path;
			fs.move(tempPath, saveDest, (err) => {
				callback(err);
			});
		}
	], (err) => {
		callback(err);
	});
};

const remove = (dest, callback) => {
	fs.unlink(dest, (err) => {
		callback(err);
	});
};

module.exports = { upload: upload, remove: remove };
