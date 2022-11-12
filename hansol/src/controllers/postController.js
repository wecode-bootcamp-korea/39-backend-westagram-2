const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  try {
    const postsData = await postService.getAllPosts();

    res.status(200).json(postsData);
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await postService.getUserPosts(userId);

    res.status(200).json(userPosts);
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const registerPost = async (req, res) => {
  try {
    const { title, content, image_url } = req.body;
    const { offset, limit } = req.query;
    const userId = req.decoded.id;
    await postService.registerPost(title, content, image_url, limit, userId);

    res.status(201).json({ message: 'postCreated' }).end();
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.decoded.id;
    await postService.deletePost(userId, postId);
    res.status(200).json({ message: 'postDeleted' });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

module.exports = { getAllPosts, getUserPosts, registerPost, deletePost };
