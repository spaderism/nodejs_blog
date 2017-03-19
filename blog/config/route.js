'use strict';

const logger = require('lib/logger')('config/route.js');

// file   : 라우팅 파일
// path   : 클라이언트로부터 받은 요청 패스
// method : 라우팅 파일 안에 만들어 놓은 객체의 함수 이름
// type   : get or post
const routeInfo = [
    // general
    { file: 'route/index', path: '/', method: 'indexGET', type: 'get' },
    { file: 'route/login', path: '/login', method: 'loginGET', type: 'get' },
    { file: 'route/login', path: '/logout', method: 'logoutGET', type: 'get'},
    { file: 'route/login', path: '/facebook', method: 'facebook', type: 'get' },
    { file: 'route/login', path: '/facebook-callback', method: 'facebookCallback', type: 'get' },
    { file: 'route/login', path: '/github', method: 'github', type: 'get' },
    { file: 'route/login', path: '/github-callback', method: 'githubCallback', type: 'get' },
    { file: 'route/login', path: '/google', method: 'google', type: 'get' },
    { file: 'route/login', path: '/google-callback', method: 'googleCallback', type: 'get' },
    { file: 'route/swagger', path: '/swagger', method: 'swaggerGET', type: 'get' },

    // api
    { file: 'route/api.login', path: '/api/login', method: 'loginPOST', type: 'post' },
    { file: 'route/api.user', path: '/api/user', method: 'userPOST', type: 'post' },
    { file: 'route/api.user', path: '/api/user', method: 'userDELETE', type: 'delete' },
    { file: 'route/api.swagger', path: '/api/swagger', method: 'swaggerGET', type: 'get' }
];

module.exports = (app) => {
    const infoLen = routeInfo.length;
    logger.debug('Number of routing module in appConfig : %d', infoLen);

    for (let i = 0; i < infoLen; i++) {
        const curItem = routeInfo[i];

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
