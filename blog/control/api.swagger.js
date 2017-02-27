'use strict';

const swaggerGET = (req, res, next) => {
	res.json(require('swagger/api.docs.js'));
};

module.exports = { swaggerGET: swaggerGET };
