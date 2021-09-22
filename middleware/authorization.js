const messageConstants = require('../utils/messageConstants');
const { sendErrorResponse } = require('../utils/response');

module.exports = (roles) => {
	return async (req, res, next) => {
		try {
			if (!roles.includes(req.user.role)) {
				throw new Error(messageConstants.middleware.NOT_AUTHORIZE_PERSON);
			}
			next();
		} catch (error) {
			sendErrorResponse(res, error.message, 403);
		}
	};
};