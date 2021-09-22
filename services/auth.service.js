const config = require("../config");
const handlebars = require("handlebars");
const fs = require("fs");
const { stringFormate } = require("../utils/fn");
const { sendMail } = require("../helpers/mail.helper");
const constants = require("../utils/constants");

const AuthService = {
	// This method is used to send email to user with link to reset password
	async sendForgotPasswordEmail(token, email) {
		try {
			let error = false,
				errorInMail = false;
			await fs.readFile(
				"./templates/forgotPassword.html",
				function (err, forgotPasswordTemplate) {
					if (err) {
						error = true;
					}
					const resetPasswordData = {
						token_mail: stringFormate(
							constants.forgotPassword.url,
							config.app.url,
							token
						),
					};
					const templateHtml = handlebars.compile(
						forgotPasswordTemplate.toString()
					);
					const bodyHtml = templateHtml(resetPasswordData);

					sendMail({
						html: bodyHtml,
						to: email,
						subject: constants.forgotPassword.subject,
					}).then(mailRes => {
						if (mailRes === "error") {
							errorInMail = true;
						} else {
							errorInMail = false;
						}
					});
				}
			);
			return { error, errorInMail };
		} catch (error) {
			throw error;
		}
	},
	// This method is used to reset password in database
	async resetPassword(token, password) {
		try {
			let error = false;

			const user = await UserModel.findOne(
				{
					"forgotPassword.token": token,
					"forgotPassword.expiredAt": { $gt: new Date() },
				},
				null,
				null,
				async (err, doc) => {
					if (err) {
						error = true;
					}
					if (!doc) {
						error = true;
					}
					doc.password = password;
					doc.forgotPassword = undefined;
					await doc.save();
					await sendMail({
						to: doc.email,
						subject: constants.resetPassword.subject,
						text: stringFormate(constants.resetPassword.text, user.email),
					});
				}
			);
			return { error };
		} catch (error) {
			throw error;
		}
	},
};

module.exports = AuthService;
