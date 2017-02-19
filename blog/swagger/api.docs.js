'use strict';

const appConfig = require('config/appConfig');
const apiDocsJson = require('swagger/api.docs.json');

apiDocsJson.host = `localhost:${appConfig.serverPort}`;
apiDocsJson.externalDocs.url = `localhost:${appConfig.serverPort}`;

module.exports = apiDocsJson;
