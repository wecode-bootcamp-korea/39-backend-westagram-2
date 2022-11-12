const express = require('express');

const router = express.Router();

const { userRouter } = require('./userRouter');
const { postRouter } = require('./postRouter');
const { withAuth } = require('../utils/checkAuth');

router.use('/users', userRouter);
router.use('/posts', withAuth, postRouter);

module.exports = { router };
