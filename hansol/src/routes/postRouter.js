const express = require('express');
const postRouter = express.Router();

const postController = require('../controllers/postController');

postRouter.get('/all', postController.getAllPosts);
postRouter.get('/:userId', postController.getUserPosts);
postRouter.post('', postController.registerPost);
postRouter.delete('/:postId', postController.deletePost);
postRouter.put('/:postId', postController.putPost);

module.exports = { postRouter };
