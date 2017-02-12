// /**
//  * shop board v1 search
//  * 쇼핑몰 게시판 조회
//  *
//  * @author 조영일 < yicho@simplexi.com >
//  * @since 2017.01.20
//  * @version 0.1
//  */

// 'use strict';

// const clone = require('clone');
// const should = require('should');
// const request = require('request');

// let option = null;
// let url = null;
// let baseParam = null;

// describe('[쇼핑몰 게시판 조회][shop_board_v1_search]', () => {
//     before((done) => {
//         option = require('test/test_global')();

//         baseParam = {
//             data_type: option.dataType,
//             mall_id: option.newMall.mallId,
//             service_type: option.newMall.serviceType,
//             auth_code: option.newMall.authCode
//         };

//         url = `${option.apiHost}/openapi/shop/board/v1/search`;

//         done();
//     });

//     context('SUCCESS', () => {
//         it('shop_no : 기본값 1', (done) => {
//             const param = {
//                 shop_no: 1
//             };

//             const options = {};
//             options.url = url;
//             options.qs = Object.assign(clone(baseParam), param);

//             request.get(options, (err, res, body) => {
//                 if (err) {
//                     throw err;
//                 }

//                 body = JSON.parse(body);
//                 const result = body.response.result;

//                 result.forEach((val) => {
//                     should.ok(val.board_no, `trace_id: ${body.meta.trace_id}`);
//                 });

//                 done();
//             });
//         });
//     });
// });
