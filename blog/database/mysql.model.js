'use strict';

const qBoardInsert = 'INSERT INTO board SET ?';
const qFileattachInsert = 'INSERT INTO fileattach SET ?';

const boardInsert = (conn, board, callback) => {
	conn.query(qBoardInsert, board, (err, result) => {
		return callback(err, result);
	});
};

const fileattachInsert = (conn, fileattach, callback) => {
	conn.query(qFileattachInsert, fileattach, (err, result) => {
		return callback(err, result);
	});
};

module.exports = {
	boardInsert: boardInsert, fileattachInsert: fileattachInsert
};
