'use strict';

const boardPOST = (req, res, next) => {

	console.log(req.files);
	console.log(req.body);

	return res.status(200).json({test: 'test'});
};

module.exports = { boardPOST: boardPOST };
