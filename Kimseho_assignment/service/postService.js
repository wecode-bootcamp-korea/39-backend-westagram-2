const postDao = require("../models/postDao");

const getAllPosts = async () => {
  const result = await postDao.getAllPosts();
  return result;
};

const getPostByUserId = async (user) => {
  const posts = await postDao.getPostByUserId(user.id);
  return {
    userId: user.id,
    userProfileImage: user.profileImage,
    posts: posts,
  };
};

const postUp = async (
  posting_title,
  posting_content,
  posting_imgUrl,
  postId
) => {
  await postDao.postUp(posting_title, posting_content, posting_imgUrl, postId);
};

const postDel = async (postId) => await postDao.postDel(postId);

const postLike = async (userId, postId) => {
  const [like] = await postDao.getLikeByUP(userId, postId);
  console.log(like);
  if (like) {
    await postDao.postLikeDel(like.id);
  } else {
    await postDao.postLike(userId, postId);
  }
};

module.exports = { getAllPosts, getPostByUserId, postUp, postDel, postLike };
