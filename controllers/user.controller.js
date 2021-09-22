const messageConstants = require('../utils/messageConstants');
const { getPagination, getPaginationData } = require('../database/common');
const { stringFormate } = require('../utils/fn');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const UserService = require('../services/user.service');

/**
	* @method get
	* @description for get list of all active user with pagination   
	* @returns {list}
*/
exports.findAllWithPagination = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);

		const { users, totalRecordOfUsers } = await UserService.getAllUsersData({ offset, limit });

		return sendSuccessResponse(res, getPaginationData({ totalRecords: totalRecordOfUsers, docs: users }, page, limit));

	} catch (error) {
		return sendErrorResponse(res, error.message);
	}
};

/**
	* @method put
	* @description for update user   
	* @returns {object}
*/
exports.updateById = async (req, res) => {
	try {
		const { id } = req.params;
		const { userNotFound, updateUser } = await UserService.updateUserById(id, req.body);
		if (userNotFound) {
			return sendErrorResponse(res, stringFormate(messageConstants.common.NOT_FOUND, 'User'));
		}
		sendSuccessResponse(res, { data: updateUser });
	} catch (error) {
		if (`${error.message}`.match(/E11000/)) {
			if(`${error.message}`.match(`email`)) {
				sendErrorResponse(res, messageConstants.user.EMAIL_ALREADY_EXISTS, 400);
			}
			else if(`${error.message}`.match(`phoneNumber`)) {
				sendErrorResponse(res, messageConstants.user.PHONE_ALREADY_EXISTS, 400);
			}
		}
		else {
			sendErrorResponse(res, error.message);
		}
	}
};

/**
	* @method delete
	* @description for delete user   
	* @returns success message
*/
exports.removeUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { deleteRecord }= await UserService.deleteUserById(id,req.user._id);
		if (!deleteRecord) {
			return sendErrorResponse(res, messageConstants.user.REMOVE_USER_FAILURE)
		}
		sendSuccessResponse(res, messageConstants.user.REMOVE_USER_SUCCESS);
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};

/**
	* @method post
	* @description for create new user   
	* @returns {object}
*/
exports.createUser = async (req, res) => {
	try {
		const { findUser = false, saveUser = [] } = await UserService.createUser(req.body);
		
		if (findUser) {
			return sendErrorResponse(res, messageConstants.auth.EMAIL_MOBILE_EXISTS, 400);
		}

		sendSuccessResponse(res, { message: messageConstants.user.USER_ACCOUNT_CREATE_SUCCESS, data: saveUser });
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};

/**
	* @method get
	* @description for get user detail by user id   
	* @returns {object}
*/
exports.findOne = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await UserService.getUserDetailsById(id);
		sendSuccessResponse(res, { data: user });
	} catch (error) {
		sendErrorResponse(res, error.message);
	}
};