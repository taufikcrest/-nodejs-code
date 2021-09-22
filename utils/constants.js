module.exports = {
	forgotPassword: {
		subject: 'Reset Password',
		text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n{0}/auth/reset-password/{1}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n',
		url: '{0}/auth/reset-password/{1}',
	},
	resetPassword: {
		subject: 'Password has been changed',
		text: 'Hello,\n\nThis is a confirmation that the password for your account {0} has just been changed.\n'
	},
	user: {
		roles: ['Admin', 'User']
	},
	roles: {
		admin: 'Admin',
		user: 'User',
	},
	klaviyoEvents: {
		trial: 'Trial',
		unsubscribed: 'Unsubscribed',
		registration: 'Registration',
		purchased: 'Purchased',
	}
};