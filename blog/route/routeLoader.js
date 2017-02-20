'use strict';

const appConfig = require('config/appConfig');
const logger = require('lib/logger')('route:routeLoader');

module.exports = (app) => {
    const infoLen = appConfig.routeInfo.length;
    logger.debug('Number of routing module in appConfig : %d', infoLen);

    for (let i = 0; i < infoLen; i++) {
        const curItem = appConfig.routeInfo[i];

        // Load in module file
        const curModule = require(curItem.file);
        logger.debug(`Read module info in [${curItem.file}] file`);

        // Routing
        const type = curItem.type.toLowerCase();
        const methods = [ '*', 'get', 'post', 'put', 'delete' ];
        if (methods.includes(type)) {
            app[type](curItem.path, curModule[curItem.method]);
        }

        logger.debug(`Comp setting routing module [${curItem.method}]`);
    }
};
