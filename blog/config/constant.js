'use strict';

const statusCodes = {
	SUCCESS: 200,
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	INTERNAL_SERVER_ERROR: 500,
	UNKNOWN_ERROR: 520
};

const statusMessages = {
	200: 'SUCCESS',
	400: 'BAD REQUEST',
	404: 'NOT FOUND',
	500: 'INTERNAL SERVER ERROR',
	520: 'UNKNOWN ERROR'
};

module.exports = {
	statusCodes: statusCodes,
	statusMessages: statusMessages
};
