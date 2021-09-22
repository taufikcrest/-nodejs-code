const jwt = require('jsonwebtoken');
const config = require('../config');
const messageConstants = require('../utils/messageConstants');
const { sendErrorResponse } = require('../utils/response');
const UserModel = require('../models/user.model');

module.exports = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || '';
		const token = (authHeader && authHeader.split(' ')[1]) || (req.cookies['token'] || '');
		if (!token) {
			sendErrorResponse(res, messageConstants.middleware.UNAUTHORIZED_ACCESS, 401);
		}

		const decoded = jwt.decode(token);
		jwt.verify(token, config.jwt.secret, async (err, user) => {
			if (err) {
				return sendErrorResponse(res, messageConstants.middleware.INVALID_TOKEN, 401);
			}

			const currentUser = await UserModel.findById(user._id).lean();

			req.me = currentUser;
			req.user = decoded;
			
			next();
		});
	} catch (error) {
		sendErrorResponse(res, messageConstants.middleware.UNAUTHORIZED_ACCESS, 401);
	}
};