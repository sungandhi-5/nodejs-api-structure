const express = require('express');
const AuthController = require('../controller/auth.controller');
const UserController = require('../controller/user.controller');
const { sessionChecker } = require('../middleware/auth-middleware');
const router = express.Router();

router.get('/dashboard', sessionChecker, UserController.getDashBoard);
router.get('/logout', sessionChecker, AuthController.getLogOut);

module.exports = router;