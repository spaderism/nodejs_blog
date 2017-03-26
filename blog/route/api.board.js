'use strict';

const multiparty = require('multiparty');
const fs = require('fs');

const boardPOST = (req, res, next) => {

	const form = new multiparty.Form();
	const test = [];

	// get field name & value
	form.on('field', (name, value) => {
		console.log('normal field / name = ' + name + ' , value = ' + value);
		if (name === 'files') {
			// console.log(JSON.parse(value));
		}
	});

     // file upload handling
	form.on('part', function(file) {
		// let filename = '';
		// let size = '';
		// // console.log(file);
		// if (file.filename) {
		// 	filename = file.filename;
 	// 		size = file.byteCount;
		// } else {
		// 	file.resume();
		// }
		// console.log("Write Streaming file :" + filename);
		// var writeStream = fs.createWriteStream('/tmp/' + filename);
		// writeStream.filename = filename;
		// file.pipe(writeStream);
		// file.on('data', function(chunk) {
		// 	console.log(filename + ' read ' + chunk.length + 'bytes');
		// });
		// file.on('end', function() {
		// 	console.log(filename + ' Part read complete');
		// 	writeStream.end();
		// });
		test.push(file);
		file.resume();
	});
	// all uploads are completed
	form.on('close', function() {
		res.status(200).json({test: 'test'});
		console.log(test);
	});
	// track progress
	form.on('progress', function(byteRead, byteExpected) {
		console.log(' Reading total  ' + byteRead + '/' + byteExpected);
	});

	form.parse(req);

	// return res.status(200).json({test: 'test'});
};

module.exports = { boardPOST: boardPOST };
