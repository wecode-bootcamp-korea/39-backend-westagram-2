const express = require('express');

const userConterollers = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', userConterollers.signup);
userRouter.post('/signin', userConterollers.login);

module.exports = { userRouter };
