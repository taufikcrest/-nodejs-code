var express = require('express');
var router = express.Router();
const authCtrl = require('../../controllers/auth.controller');

/**
 * Route to return user details and token by register new user
 * @method POST/
 * @name signup
 */
router.post('/signup', authCtrl.signup);

/**
 * Route to return user details and token by login
 * @method POST/
 * @name login
 */
router.post('/login', authCtrl.login);

/**
 * Route to return link on mail
 * @method POST/
 * @name forgotPassword
 */
router.post('/forgot-password', authCtrl.forgotPassword);

/**
 * Route to return updated password
 * @method POST/
 * @name resetPassword
 */
router.post('/reset-password', authCtrl.resetPassword);

/**
 * Route to return message and seesion expire for particular user
 * @method POST/
 * @name logout
 */
router.get('/logout', authCtrl.logout);

module.exports = router;