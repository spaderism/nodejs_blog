'use strict';

const swaggerGET = (req, res, next) => {
	res.redirect('/swagger-ui?url=/swagger.json');
};

module.exports = { swaggerGET: swaggerGET };
