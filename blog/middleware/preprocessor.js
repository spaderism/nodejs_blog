'use strict';

const logger = require('lib/logger')('middleware/preprocessor.js');
const appConfig = require('config/app');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const Joi = require('joi');
const typeis = require('type-is');
const formidable = require('formidable');
const qs = require('qs');
const async = require('async');

class Validation {
	static apiloginpost(req, res, callback) {
		const schema = Joi.object().keys({
			email: Joi.string().email().required()
		});

		Joi.validate({ email: req.body.email }, schema, (err) => {
			if (err) return callback({ isValid: false, message: err.name });
			callback({ isValid: true });
		});
	}

	static apiuserpost(req, res, callback) {
		req.body.password = req.body.provider === 'local' ? req.body.password : 'third_party_default_password1!';
		req.body.confirm_password = req.body.provider === 'local' ? req.body.confirm_password : 'third_party_default_password1!';

		const model = {};

		model.name = req.body.name;
		model.email = req.body.email;
		model.provider = req.body.provider;
		model.password = req.body.password;
		model.confirmPassword = req.body.confirm_password;
		model.masterKey = req.body.master_key;

		if (model.password !== model.confirmPassword) {
			return callback({ isValid: false, message: 'not equal password with confirm_password' });
		}

		if (model.provider !== 'local') {
			const thirdParty = req.body[model.provider] || {};

			model.thirdPartyEmail = thirdParty.email || null;
			model.thirdPartyId = thirdParty.id || null;

			if (model.thirdPartyEmail !== model.email) {
				return callback({ isValid: false, message: `not equal ${model.provider} email with email` });
			}
		}

		const schema = Joi.object().keys({
			provider: [ 'local', 'facebook', 'github', 'google' ],
			name: Joi.string().min(3).max(30).required(),
			email: Joi.string().email().required(),
			password: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/).required(),
			confirmPassword: Joi.string().regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/).required(),
			masterKey: appConfig.masterKey,
			thirdPartyEmail: Joi.string().email(),
			thirdPartyId: Joi.number()
		});

		Joi.validate(model, schema, (err) => {
			if (err) return callback({ isValid: false, message: err.name });
			callback({ isValid: true });
		});
	}

	static apiuserdelete(req, res, callback) {
		const schema = Joi.object().keys({
			userId: Joi.string().required(),
			masterKey: appConfig.masterKey
		});

		Joi.validate({ userId: req.body.user_id, masterKey: req.body.master_key }, schema, (err) => {
			if (err) return callback({ isValid: false, message: err.name });
			callback({ isValid: true });
		});
	}

	static apiboardpost(req, res, callback) {
		const model = {
			category: req.body.category,
			title: req.body.title,
			masterKey: req.body.master_key,
			content: req.body.content
		};

		const schema = Joi.object().keys({
			category: appConfig.board.category,
			title: Joi.string().max(65).required(),
			masterKey: appConfig.masterKey,
			content: Joi.string().required()
		});

		Joi.validate(model, schema, (err) => {
			if (err) return callback({ isValid: false, message: err.name });
			callback({ isValid: true });
		});
	}

	static xssFilter(object) {
	    for (const prop of Object.keys(object)) {
	        if (typeof object[prop] === 'object') {
	            this.xssFilter(object[prop]);
	        } else {
	            object[prop] = (object[prop]).replace(/\&/g, '&#38;')
            				 .replace(/\"/, '&#34;').replace(/\'/, '&#39;')
            				 .replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
            				 .replace(/\(/g, '&#40;').replace(/\)/g, '&#41;');
	        }
	    }
	}
};

const multipartParser = (req, res, callback) => {
	if (typeis(req, ['multipart'])) {
		const form = new formidable.IncomingForm();
		form.keepExtensions = true;
		form.maxFieldsSize = 10485760;
		form.maxFields = 500000;
		form.multiples = true;

		form.parse(req, (err, fields, files) => {
			if (err) return callback(err);

			const qsOptions = { arrayLimit: 50000, parameterLimit: 500000 };
			req.body = qs.parse(qs.stringify(fields), qsOptions);
			req.files = files;

			callback();
		});
	} else {
		callback();
	}
};

module.exports = (req, res, next) => {
	logger.debug('유효성 검사 미들웨어');

	if (!req.url.startsWith('/api')) return next();

	async.series([
		(callback) => {
			multipartParser(req, res, (err) => {
				callback(err);
			});
		}
	], (err) => {
		if (err) return next(err);

		const validMethod = Validation[`${req.url.split('/').join('')}${req.method.toLowerCase()}`];

		if (validMethod) {
			validMethod(req, res, (result) => {
				if (!result.isValid) {
					const meta = {};
					meta.code = constant.statusCodes.BAD_REQUEST;
					meta.message = result.message;

					return endpoint(req, res, { meta: meta });
				}

				Validation.xssFilter(req.method === 'GET' ? req.query : req.body);
				next();
			});
		} else {
			Validation.xssFilter(req.method === 'GET' ? req.query : req.body);
			next();
		}
	});
};
