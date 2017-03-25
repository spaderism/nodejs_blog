'use strict';

const logger = require('lib/logger')('middleware/validation.js');
const appConfig = require('config/app');
const constant = require('config/constant');
const endpoint = require('lib/endpoint');
const Joi = require('joi');

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

	static xssFilter(object) {
	    for (const prop of Object.keys(object)) {
	        if (typeof object[prop] === 'object') {
	            this.xssFilter(object[prop]);
	        } else {
	            object[prop] = (object[prop]).replace(/\#/g, '&#35;').replace(/\&/g, '&#38;')
		            				.replace(/\"/, '&#34;').replace(/\'/, '&#39;')
		            				.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
		            				.replace(/\(/g, '&#40;').replace(/\)/g, '&#41;');
	        }
	    }
	}
};

module.exports = (req, res, next) => {
	logger.debug('유효성 검사 미들웨어');

	if (!req.url.startsWith('/api')) return next();

	const validation = Validation[`${req.url.split('/').join('')}${req.method.toLowerCase()}`];

	if (validation) {
		validation(req, res, (result) => {
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
};
