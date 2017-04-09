'use strict';

const logger = require('lib/logger')('route/api.board.js');
const appConfig = require('config/app');
const rdbModel = require('database/mysql.model');
const attachUtil = require('lib/attachUtil');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const async = require('async');


const boardPOST = (req, res, next) => {
	logger.debug('boardPOST 호출됨');

	console.log(req.files);

	const connPool = req.app.get('database').mysqldb.connPool;

	connPool.getConnection((err, conn) => {
		if (err) return next(err);
		beginTransaction(conn);
	});

	const beginTransaction = (conn) => {
		conn.beginTransaction((err) => {
			if (err) return next(err);

			async.waterfall([
				(callback) => {
					const board = {
						category: req.body.category,
						title: req.body.title,
						content: req.body.content
					};

					rdbModel.boardInsert(conn, board, (err, result) => {
						if (err) return callback(err);
						callback(result.insertId);
					});
				},
				(boardInsertId, callback) => {
					async.forEachOf(req.files, (file, key, _callback) => {
						if (file.size > 5242880 || !(file.type).startsWith('image')) {
							return _callback(new Error('BAD_REQUEST'));
						}

						const splitKey = key.split('/');
						const saveDest = `${appConfig.uploadPath}/${splitKey[3]}/${splitKey[4]}/${splitKey[5]}`;

						attachUtil.upload(file, saveDest, (err) => {
							if (err) return _callback(err);

							const fileattach = { bno: boardInsertId, dest_dir: saveDest };

							rdbModel.fileattachInsert(conn, fileattach, (err, result) => {
								if (err) {
									attachUtil.remove(saveDest, (_err) => {
										if (_err) logger.error(`file remove err: ${err}`);
										return _callback(err);
									});
								}

								_callback();
							});
						});
					}, (err) => {
						return callback(err);
					});
				},
				(callback) => {
					conn.commit((err) => {
						callback(err);
					});
				}
			], (err) => {
				if (err) {
					conn.rollback();

					if (err.message === 'BAD_REQUEST') {
						const meta = {};

						meta.code = constant.statusCodes.BAD_REQUEST;
						meta.message = constant.statusMessage[meta.code];

						return endpoint(req, res, { meta: meta });
					}

					return next(err);
				}

				conn.release();

				endpoint(req, res, ).......
			});
		});
	};
};

module.exports = { boardPOST: boardPOST };
