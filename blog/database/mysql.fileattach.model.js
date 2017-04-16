'use strict';

const INSERT_QUERY = 'INSERT INTO fileattach SET ?';

const insert = (connection, fileattach, callback) => {
	connection.query(INSERT_QUERY, fileattach, (err, result) => {
		return callback(err, result);
	});
};

module.exports = {
	insert: insert
};
