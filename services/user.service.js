const _ = require("lodash");
const moment = require("moment");
const { getCount } = require("../database/common");
const UserModel = require("../models/user.model");
const constants = require("../utils/constants");
const {
	createKlaviyoProfile,
	createKlaviyoEvent,
} = require("../helpers/klaviyo.helper");
const bcrypt = require("bcrypt");
const { generateJWTToken, randomHex } = require("../utils/fn");

const UserService = {
	// This method is used to retrive a list of user with page and size
	async getAllUsersData({ offset, limit }) {
		try {
			const whereClause = {
				deletedAt: null,
				deletedBy: null,
				role: constants.roles.user,
			};

			const users = await UserModel.find(whereClause)
				.sort({ _id: -1 })
				.skip(offset)
				.limit(limit)
				.lean();

			const totalRecordOfUsers = await getCount(UserModel, whereClause);
			return { users, totalRecordOfUsers };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to add user detail by admin
	async createUser(bodyData) {
		try {
			let { email, password, firstName, lastName, phoneNumber } = bodyData;

			const user = new UserModel({
				email,
				password,
				firstName,
				lastName,
				phoneNumber,
			});

			const findUser = await UserModel.findOne({
				$or: [
					{
						email,
					},
					{
						phoneNumber,
					},
				],
			});

			if (findUser) {
				return { findUser };
			}
			const saveUser = await user.save();

			// creating klaviyo public profile
			createKlaviyoProfile(email, firstName, lastName, phoneNumber);

			// creating klaviyo registration event
			createKlaviyoEvent(email, constants.klaviyoEvents.registration);

			return { findUser, saveUser };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to retrieve a user detail by id
	async getUserDetailsById(id) {
		try {
			let user = await UserModel.findById(id);
			if (user && user !== null)
				user.phoneNumber = user.phoneNumber;
			else user = [];
			return user;
		} catch (error) {
			throw error;
		}
	},
	// This method is used to retrieve a user detail by email
	async getUserDetailsByEmail(email) {
		try {
			let user = await UserModel.findOne({
				email: email,
				deletedAt: null,
				deletedBy: null,
			}).select("+password");
			if (
				!_.isEmpty(user) &&
				user.email.toLowerCase() !== email.toLowerCase()
			) {
				user = null;
			}
			return { user };
		} catch (error) {
			throw error;
		}
	},
	// This common method is used to update a user detail
	async updateUserData(bodyData, user) {
		try {
			const { email, password, firstName, lastName, phoneNumber } = bodyData;

			if (password) {
				const bcryptSalt = await bcrypt.genSalt(10);
				password = await bcrypt.hash(password, bcryptSalt);
			}

			let requestUser = {
				...(phoneNumber ? { phoneNumber } : {}),
				...(email ? { email } : {}),
				...(firstName ? { firstName } : {}),
				...(password ? { password } : {}),
				...(lastName ? { lastName } : {}),
			};

			_.map(requestUser, (userField, key) => {
				user[key] = requestUser[key];
			});

			// add updatedBy to get track of the updates
			user.updatedBy = user._id;

			const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {
				new: true,
				upsert: true,
			}).lean();
			// eslint-disable-next-line no-unused-vars
			const { password: hash, ...data } = updatedUser;

			return data;
		} catch (error) {
			throw error;
		}
	},
	// This method is used to update a user detail by id
	async updateUserById(id, bodyData) {
		try {
			const user = await UserModel.findById(id).lean();
			if (!user) {
				return { userNotFound: true };
			}
			const updateUser = await this.updateUserData(bodyData, user);
			return { userNotFound: false, updateUser };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to delete a user detail by id
	async deleteUserById(id, deletedBy) {
		try {
			const deleteRecord = await UserModel.findOne({ _id: id });
			if (!deleteRecord) {
				return { deleteRecord };
			}

			// appending _deleted_userId in the deleted records email and phoneNumber to allow unique constraint
			await UserModel.findByIdAndUpdate(id, {
				deletedAt: moment(),
				deletedBy: deletedBy,
				email: deleteRecord.email + "_deleted_" + deleteRecord._id,
				phoneNumber: deleteRecord.phoneNumber + "_deleted_" + deleteRecord._id,
			});
			return { deleteRecord };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to add sign up user detail by own
	async signUpUser(bodyData) {
		try {
			let {
				email,
				password,
				firstName,
				lastName,
				phone: phoneNumber,
			} = bodyData;

			const user = new UserModel({
				email: email.toLowerCase(),
				password,
				firstName,
				lastName,
				phoneNumber,
			});
			let errorInRegistartion, existingUser, token, data;
			await UserModel.findOne(
				{
					$or: [
						{
							email,
						},
						{
							phoneNumber,
						},
					],
				},
				(err, userExist) => {
					if (err) {
						errorInRegistartion = true;
					}
					if (userExist) {
						existingUser = true;
					} else {
						user.save((err, doc) => {
							if (err) {
								errorInRegistartion = true;
								return;
							}

							token = generateJWTToken(doc._id, doc.role);

							// eslint-disable-next-line no-unused-vars
							const { password: hash, ...data } = doc.toJSON();

							// creating klaviyo public profile
							createKlaviyoProfile(email, firstName, lastName, phoneNumber);

							// creating klaviyo registration event
							createKlaviyoEvent(email, constants.klaviyoEvents.registration);
						});
					}
				}
			);
			return { errorInRegistartion, existingUser, token, data };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to set forgot password object in database for user using email
	async forgotPassword(email) {
		try {
			const token = randomHex();
			const user = await UserModel.findOneAndUpdate(
				{ email },
				{
					forgotPassword: {
						token,
						expiredAt: moment().add(15, "minutes").toDate(),
					},
				}
			);
			return { token, user };
		} catch (error) {
			throw error;
		}
	},
};

module.exports = UserService;
