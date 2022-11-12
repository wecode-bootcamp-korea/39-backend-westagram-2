const postDao = require('../models/postDao');

const getAllPosts = async () => {
  return await postDao.getAllPosts();
};

const getUserPosts = async (userId) => {
  return await postDao.getUserPosts(userId);
};

const registerPost = async (title, content, image_url, limit, userId) => {
  if (limit > 100) {
    throw new Error('100개를 초과할 수 없습니다.');
  }
  if (!title) {
    const err = new Error('제목이 없습니다.');
    err.statusCode = 400;
    throw err;
  }
  if (!content) {
    const err = new Error('내용이 없습니다.');
    err.statusCode = 400;
    throw err;
  }

  await postDao.registerPost(title, content, image_url, userId);
};

const deletePost = async (userId, postId) => {
  const postUserId = await postDao.getUserId(postId);
  if (!postUserId) {
    const err = new Error('게시물이 존재하지 않습니다.');
    err.statusCode = 400;
    throw err;
  }
  if (postUserId.user_id !== userId) {
    const err = new Error('해당 게시물 삭제 권한이 없습니다.');
    err.statusCode = 403;
    throw err;
  }
  await postDao.deletePost(postId);
};
module.exports = { getAllPosts, getUserPosts, registerPost, deletePost };
