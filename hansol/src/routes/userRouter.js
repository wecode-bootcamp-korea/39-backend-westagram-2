const express = require('express');

const userRouter = express.Router();
const userConterollers = require('../controllers/userController');

userRouter.post('/signup', userConterollers.signup);
userRouter.post('/login', userConterollers.login);
userRouter.get('/all', userConterollers.getAllUsers);

module.exports = { userRouter };
