const jwt = require('jsonwebtoken');
const config = require('../config');
const crypto = require('crypto');

exports.generateJWTToken = (id, role) => {
	return jwt.sign({ _id: id, role: role }, config.jwt.secret, { expiresIn: config.jwt.expiredIn });
};

exports.randomHex = (len = 32) => crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);

exports.stringFormate = function () {
	let str = arguments[0];
	for (var i = 1; i < arguments.length; i++) {
		const regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
		str = str.replace(regEx, arguments[i]);
	}
	return str;
};