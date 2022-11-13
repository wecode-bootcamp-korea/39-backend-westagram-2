const likeDao = require('../models/likeDao');

const likePost = async (userId, postId) => {
  const postUserId = await likeDao.getUserId(postId);
  if (!postUserId) {
    const err = new Error('게시물이 존재하지 않습니다.');
    err.statusCode = 400;
    throw err;
  }
  const likeData = await likeDao.checkLikePost(userId, postId);
  const checkList = Number(likeData?.checkList);
  if (checkList === 1) {
    await likeDao.cancelLikePost(userId, postId);
  } else {
    await likeDao.likePost(userId, postId);
  }
};

module.exports = { likePost };
