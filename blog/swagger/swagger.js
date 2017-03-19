'use strict';

const appConfig = require('config/app');
const swaggerJson = require('swagger/swagger.json');

swaggerJson.host = `localhost:${appConfig.serverPort}`;
swaggerJson.externalDocs.url = `localhost:${appConfig.serverPort}`;

module.exports = swaggerJson;
