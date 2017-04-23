'use strict';

const logger = require('lib/logger')('route/board.js');
const boardDao = require('database/mysql.board.model');
const appConfig = require('config/app');
const endpoint = require('lib/endpoint');

const boardGET = (req, res, next) => {
	logger.debug(req.query.category);

	const pageNo = req.query.page_no ? req.query.page_no : 1;
	const start = (pageNo - 1) * appConfig.board.howmanyPerPage + 1;

	const conditions = {
		start: start,
		howmanyPerPage: appConfig.board.howmanyPerPage,
		searchType: req.query.search_type,
		searchKeyword: req.query.search_keyword,
		category: req.query.category
	};

	boardDao.select(conditions, (err, boardList) => {
		if (err) return next(err);
		const countAll = boardList.length;
		const lastPage = (countAll % conditions.howmanyPerPage === 0)
					   ? parseInt(countAll / conditions.howmanyPerPage)
					   : parseInt(countAll / conditions.howmanyPerPage) + 1;
		const curTab = parseInt((pageNo - 1) / appConfig.board.pageNationUnit);
		const beginPage = (curTab - 1) * appConfig.board.pageNationUnit + 1;
		const endPage = (curTab * appConfig.board.pageNationUnit > lastPage)
					  ? lastPage : curTab * appConfig.board.pageNationUnit;

		const board = {
			board_list: boardList,
			page_no: pageNo,
			begin_page: beginPage,
			last_page: lastPage,
			end_page: endPage,
			size: appConfig.board.howmanyPerPage
		};

		res.render('index', {
			user: req.session.user,
			board: board
		});

    	endpoint(req, res);
	});
};

module.exports = { boardGET: boardGET };
