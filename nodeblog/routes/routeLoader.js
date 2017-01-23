'use strict';

const appConfig = require('config/appConfig');
const logger = require('lib/logger')('routes:routeLoader');

module.exports = (app) => {
    const infoLen = appConfig.routeInfo.length;
    logger.debug('Number of routing module in appConfig : %d', infoLen);

    for (let i = 0; i < infoLen; i++) {
        const curItem = appConfig.routeInfo[i];

        // Load in module file
        const curModule = require(curItem.file);
        logger.debug('Read module info in $s file', curItem.file);

        // Routing
        if (curItem.type === 'get') {
            app.get(curItem.path, curModule[curItem.method]);
        } else {
            app.post(curItem.path, curModule[curItem.method]);
        }

        logger.debug('Comp setting routing module[%s]', curItem.method);
    }
};
