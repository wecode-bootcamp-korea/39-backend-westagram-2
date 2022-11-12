const { dataSource } = require('./dataSource');

const getAllPosts = async () => {
  const allPosts = await dataSource.query(
    `
    SELECT
      u.id AS userId,
      u.profile_image AS userProfileImage,
      p.id AS postingId,
      p.title AS potingTitle,
      p.image_url AS postingImageUrl,
      p.content AS postingContent
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id
    `
  );
  return allPosts;
};

const getUserPosts = async (userId) => {
  const userPosts = await dataSource.query(
    `
      SELECT
        u.id userId,
        u.profile_image userProfileImage,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'postingId', p.id,
            'postingImageUrl', p.image_url,
            'postingContnet', p.content)
          ) as postings
      FROM users u
      JOIN posts p ON p.user_id = u.id
      WHERE u.id = ?
      GROUP BY u.id
    `,
    [userId]
  );
  console.log('userPosts: ', userPosts);
  return userPosts;
};

const registerPost = async (title, content, image_url, userId) => {
  await dataSource.query(
    `
      INSERT INTO posts (
        title,
        content, 
        image_url,
        user_id
      ) VALUES (?,?,?,?);
    `,
    [title, content, image_url, userId]
  );
};

const getUserId = async (postId) => {
  console.log(postId);
  const [postUserId] = await dataSource.query(
    `
    SELECT
      posts.user_id
    FROM posts
    WHERE posts.id = ? 
  `,
    [postId]
  );
  return postUserId;
};

const deletePost = async (postId) => {
  await dataSource.query(
    `
      DELETE 
    FROM posts p
    WHERE p.id = ?
    `,
    [postId]
  );
};

module.exports = {
  getAllPosts,
  getUserPosts,
  registerPost,
  deletePost,
  getUserId,
};
