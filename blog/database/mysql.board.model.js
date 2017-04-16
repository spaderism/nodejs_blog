'use strict';

const INSERT_QUERY = 'INSERT INTO board SET ?';

const insert = (connection, board, callback) => {
	connection.query(INSERT_QUERY, board, (err, result) => {
		return callback(err, result);
	});
};

module.exports = {
	insert: insert
};
