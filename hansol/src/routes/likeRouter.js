const express = require('express');
const likeRouter = express.Router();

const likeController = require('../controllers/likeControllers');

likeRouter.post('/:postId', likeController.likePost);

module.exports = { likeRouter };
