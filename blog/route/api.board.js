'use strict';

const logger = require('lib/logger')('route/api.board.js');
const appConfig = require('config/app');
const boardDao = require('database/mysql.board.model');
const fileattachDao = require('database/mysql.fileattach.model');
const attachUtil = require('lib/attachUtil');
const endpoint = require('lib/endpoint');
const async = require('async');

const boardPOST = (req, res, next) => {
	logger.debug('boardPOST 호출됨');

	const connectionPool = req.app.get('database').mysql.connectionPool;
	connectionPool.getConnection((err, connection) => {
		if (err) {
			connection.release();
			return next(err);
		}

		logger.debug('connection 얻음.');
		beginTransaction(connection);
	});

	const beginTransaction = (connection) => {
		connection.beginTransaction((err) => {
			if (err) {
				connection.release();
				return next(err);
			}

			logger.debug('트랜잭션 시작.');
			insertTasks(connection);
		});
	};

	const insertTasks = (connection) => {
		async.waterfall([
			(callback) => {
				const board = {
					bno: req.body.bno,
					category: req.body.category,
					title: req.body.title,
					content: req.body.content
				};

				boardDao.insert(connection, board, (err, result) => {
					if (err) return callback(err);

					logger.debug(`board insert 성공, insertId: ${result.insertId}`);
					callback(null, result.insertId);
				});
			},
			(insertId, callback) => {
				if (!Object.keys(req.files).length) return callback(null);

				logger.debug('첨부파일 다운로드 시작');

				const uploadPath = appConfig.uploadPath;
				async.forEachOf(req.files, (value, key, iterateeCallback) => {
					const saveDest = uploadPath + key.replace('/image/upload', '');
					attachUtil.upload(value, saveDest, (err) => {
						if (err) {
							attachUtil.remove(saveDest, (err) => {
								if (err) logger.error(err);
							});

							return iterateeCallback(err);
						}

						const fileattach = {
							bno: insertId,
							dest_dir: key,
						};

						fileattachDao.insert(connection, fileattach, (err, result) => {
							if (err) {
								attachUtil.remove(saveDest, (err) => {
									if (err) logger.error(err);
								});

								return iterateeCallback(err);
							}

							iterateeCallback();
						});
					});
				}, (err) => {
					callback(err);
				});
			}
		], (err, result) => {
			if (err) {
				logger.error(`에러 발생, 롤백! ${err}`);

				return connection.rollback(() => {
					connection.release();
					next(err);
				});
			}

			connection.commit((err) => {
				if (err) {
					return connection.rollback(() => {
						connection.release();
						next(err);
					});
				}

				logger.debug('board, file insert 성공');
				connection.release();
			});
		});
	};
};

module.exports = { boardPOST: boardPOST };
