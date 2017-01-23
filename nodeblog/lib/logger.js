'use strict';

const debug = require('debug');

module.exports = (alias) => {
    const logger = {
        error: debug(`[${process.pid}][NODEBLOG] ${alias}:error`),
        debug: debug(`[${process.pid}][NODEBLOG] ${alias}:debug`),
        info: debug(`[${process.pid}][NODEBLOG] ${alias}:info`)
    };
    logger.debug.log = console.log.bind(console);
    logger.info.log = console.log.bind(console);
    return logger;
};
