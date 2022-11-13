const express = require('express');

const router = express.Router();

const { withAuth } = require('../utils/checkAuth');
const { userRouter } = require('./userRouter');
const { postRouter } = require('./postRouter');
const { likeRouter } = require('./likeRouter');

router.use('/users', userRouter);
router.use('/posts', withAuth, postRouter);
router.use('/likes', withAuth, likeRouter);

module.exports = { router };
