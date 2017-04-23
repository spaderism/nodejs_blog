'use strict';

const insert = (connection, board, callback) => {
	const INSERT_QUERY = 'INSERT INTO board SET ?';
	connection.query(INSERT_QUERY, board, (err, result) => {
		return callback(err, result);
	});
};

const select = (connection, conditions, callback) => {

};

module.exports = {
	insert: insert, select: select
};
