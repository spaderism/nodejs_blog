'use strict';

const swaggerGET = (req, res, next) => {
	res.json(require('swagger/swagger.js'));
};

module.exports = { swaggerGET: swaggerGET };
