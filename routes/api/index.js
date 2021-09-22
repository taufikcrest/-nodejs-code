const express = require('express');
const authentication = require('../../middleware/authentication');
const authorization = require('../../middleware/authorization');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const constants = require('../../utils/constants');
const router = express.Router();


// Public Routes 
router.use('/auth', authRoutes);

// Middleware to check token
router.use(authentication);

// Admin Routes, adding admin authentication middleware
router.use('/admin', authorization([constants.roles.admin]), adminRoutes);

module.exports = router;