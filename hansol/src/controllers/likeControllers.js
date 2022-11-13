const likeService = require('../services/likeService');

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.decoded.id;

    await likeService.likePost(userId, postId);
    res.status(200).end();
  } catch (err) {
    res.status(err.statusCode || 400).json({ mesesage: err.mesesage });
  }
};

module.exports = { likePost };
