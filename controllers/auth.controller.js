const messageConstants = require('../utils/messageConstants');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { generateJWTToken } = require('../utils/fn');
const UserService = require('../services/user.service');
const AuthService = require('../services/auth.service');

/**
	* @method post
	* @description for create new user and new account
	* @returns {object}
*/
exports.signup = async (req, res) => {
	try {
		res.clearCookie('token');
		const { errorInRegistartion = false, existingUser = false, token, data } = await UserService.signUpUser(req.body);

		if (errorInRegistartion) { return sendErrorResponse(res, messageConstants.auth.ERROR_IN_REGISTRATION); }
		if (existingUser) {
			return sendErrorResponse(res, messageConstants.auth.EMAIL_MOBILE_EXISTS, 400);
		}	
		res.cookie('token', token);
		return sendSuccessResponse(res, {
			message: messageConstants.auth.SINGUP_SUCCESS,
			token,
			data
		});

	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};

/**
	* @method post
	* @description for login in user account
	* @returns {object}
*/
exports.login = async (req, res) => {
	try {
		res.clearCookie('token');
		const { email, password } = req.body;

		// matching case-insensitive email
		const { user } = await UserService.getUserDetailsByEmail(email);

		if (!user) {
			return sendErrorResponse(res, messageConstants.common.USER_NOT_AWARE, 403);
		}

		if (!user.isActive) { return sendErrorResponse(res, messageConstants.auth.USER_ACCOUNT_NOT_ACTIVE, 401); }

		user.comparePassword(password, async (err, isMatch) => {
			if (err) { return sendErrorResponse(res, messageConstants.auth.EMAIL_PASSWORD_NOT_VALID, 401); }
			if (!isMatch) { return sendErrorResponse(res, messageConstants.auth.EMAIL_PASSWORD_NOT_VALID, 401); }
			const token = generateJWTToken(user._id, user.role);

			// eslint-disable-next-line no-unused-vars
			const { password: hash, ...data } = user.toJSON();

			// removing referral data as not to make it exposed
			delete data.referral;
			res.cookie('token', token);

			return sendSuccessResponse(res, {
				message: messageConstants.auth.LOGIN_SUCCESS,
				token,
				data
			});
		});
	}
	catch (error) {
		sendErrorResponse(res, error.message);
	}
};

/**
	* @method get
	* @description for logout from user account
	* @returns success message
*/
exports.logout = async (req, res) => {
	try {
		res.clearCookie('token');
		sendSuccessResponse(res, messageConstants.auth.LOGOUT_SUCCESS);
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};

/**
	* @method post
	* @description for send mail for change password
	* @returns success message
*/
exports.forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		res.clearCookie('token');
		const { token, user } = await UserService.forgotPassword(email);

		if (!user) {
			return sendErrorResponse(res, messageConstants.common.USER_NOT_AWARE, 401);
		}
		const { error, errorInMail } = await AuthService.sendForgotPasswordEmail(token, email);
		if(error) {
			return sendErrorResponse(res, messageConstants.auth.ERROR_SEND_EMAIL);
		} else if(errorInMail) {
			sendSuccessResponse(res, { message: messageConstants.auth.FORGOT_PASSWORD_SUCCESS, token })
		} else {
			sendSuccessResponse(res, { message: messageConstants.auth.FORGOT_PASSWORD_EMAIL_SENT_SUCCESS, token })
		}
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};


/**
	* @method post
	* @description for reset password of user
	* @returns success message
*/
exports.resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		res.clearCookie('token');
		const { error } = await AuthService.resetPassword(token, password);
		if (error) { return sendErrorResponse(res, messageConstants.auth.RESET_PASSWORD_TOKEN_INVALID); }
		else { return sendSuccessResponse(res, messageConstants.auth.RESET_PASSWORD_SUCCESS); }
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};