const nodemailer = require('nodemailer');
const config = require('../config');

const transport = nodemailer.createTransport({
	host: config.smtp.host,
	port: config.smtp.port,
	auth: {
		user: config.smtp.user,
		pass: config.smtp.pass
	},
	secure: config.smtp.secure
});

const from = config.smtp.sender;

/**
* @method sendMail
* @description For sending Email
* @param email to, subject, text
* @returns mail send success
*/

exports.sendMail = async ({ to, subject, text, html }) => {
	try {
		const message = { from, to, subject, text, html };
		return await transport.sendMail(message);
	} catch (e) {
		return "error";
	}
};