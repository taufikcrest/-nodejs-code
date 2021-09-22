const express = require('express');
const router = express.Router();

const userCtrl = require('../../controllers/user.controller');

/**
 * Route to return user detail.
 * @method GET/
 * @name findOne
 */
router.get('/user/:id', userCtrl.findOne);

/**
 * Route to return user detail with pagination.
 * @method GET/
 * @name findAllWithPagination
 */
router.get('/users', userCtrl.findAllWithPagination);

/**
 * Route to return new  user.
 * @method POST/
 * @name createUser
 */
router.post('/user', userCtrl.createUser);

/**
 * Route to return user  update by user Id
 * @method PUT/
 * @name updateById
 */
router.put('/user/:id', userCtrl.updateById);

/**
 * Route to return message which is deleted by userId
 * @method DELETE/
 * @name removeUser
 */
router.delete('/user/:id', userCtrl.removeUser);

module.exports = router;
