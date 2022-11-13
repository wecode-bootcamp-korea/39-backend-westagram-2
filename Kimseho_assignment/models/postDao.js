const { database } = require("./dataSource");

const getAllPosts = async () => {
  const result = await database.query(`
    SELECT
          users.id AS userId,
          users.profile_image AS userProfileImage,
          posts.id AS postingId,
          posts.posting_imgUrl AS postingImageUrl,
          posts.posting_content AS postingContent
    FROM users
    LEFT JOIN posts ON posts.user_id = users.id`);

  return result;
};

const getPostByUserId = async (userId) => {
  const result = await database.query(
    `
  SELECT
        id,
        posting_imgUrl,
        posting_content
  FROM posts
  WHERE user_id = ?`,
    [userId]
  );
  return result;
};

const postUp = async (
  posting_title,
  posting_content,
  posting_imgUrl,
  postId
) => {
  await database.query(
    `
  UPDATE posts
  SET
        posting_title = ?,
        posting_content = ?,
        posting_imgUrl = ?
  WHERE id = ?
  `,
    [posting_title, posting_content, posting_imgUrl, postId]
  );
};

const postDel = async (postId) => {
  await database.query(
    `
  DELETE FROM posts
  WHERE posts.id = ?`,
    [postId]
  );
};

const getLikeByUP = async (userId, postId) => {
  const result = await database.query(
    `SELECT 
        id,
        user_id,
        post_id
    FROM likes
    WHERE user_id =? AND post_id =?`,
    [userId, postId]
  );
  return result;
};

const postLikeDel = async (likeId) => {
  await database.query(
    `DELETE FROM likes
    WHERE id = ?`,
    [likeId]
  );
};

const postLike = async (userId, postId) => {
  await database.query(
    `INSERT INTO likes(
        user_id,
        post_id)
    VALUES (?,?)`,
    [userId, postId]
  );
};

module.exports = {
  getAllPosts,
  getPostByUserId,
  postUp,
  postDel,
  getLikeByUP,
  postLikeDel,
  postLike,
};
