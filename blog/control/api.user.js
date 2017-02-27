'use strict';

const passport = require('passport');
const endpoint = require('lib/endpoint');
const constant = require('config/constant');

const userPOST = (req, res, next) => {
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

        endpoint(req, res, { meta: meta, response: { user_id: user._id } });
    })(req, res, next);
};

const userDELETE = (req, res, next) => {
    const database = req.app.get('database');
    database.mongodb.UserModel.findByIdAndRemove(req.body.user_id, (err, user) => {
        if (err) throw err;

        const meta = {};

        if (!user) {
            meta.code = constant.statusCodes.BAD_REQUEST;
            meta.message = constant.statusMessages[meta.code];

            return endpoint(req, res, { meta: meta });
        }

        meta.code = constant.statusCodes.SUCCESS;
        meta.message = constant.statusMessages[meta.code];

        endpoint(req, res, { meta: meta, response: { user_id: user._id } });
    });
};

module.exports = { userPOST: userPOST, userDELETE: userDELETE };
