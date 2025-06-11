const express = require('express');
const AuthController = require('../controller/auth.controller');
const router = express.Router();

// POST Routes
router.post('/login', AuthController.postLogin);
router.post('/signup', AuthController.postSignup);


module.exports = router;