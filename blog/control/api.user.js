'use strict';

const passport = require('passport');
const endpoint = require('lib/endpoint');
const constant = require('config/constant');

const signupPOST = (req, res, next) => {
	passport.authenticate('signup', (err, user) => {
        if (err) throw err;

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = req.flash('message')[0];

            return endpoint(req, res, { meta: meta });
        }

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        endpoint(req, res, { meta: meta, response: req.body });
    })(req, res, next);
};

const deletePOST = (req, res, next) => {

};

module.exports = { signupPOST: signupPOST, deletePOST: deletePOST };
