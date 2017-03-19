'use strict';

const swaggerGET = (req, res, next) => {
	res.redirect('/swagger-ui?url=/api/swagger');
};

module.exports = { swaggerGET: swaggerGET };
