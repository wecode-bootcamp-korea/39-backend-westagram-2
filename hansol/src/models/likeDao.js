const { dataSource } = require('./dataSource');

const getUserId = async (postId) => {
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

const checkLikePost = async (userId, postId) => {
  const [likeData] = await dataSource.query(
    `SELECT EXISTS(
        SELECT *
        FROM likes l
        WHERE l.user_id = ? AND l.post_id = ?
        ) AS checkList
      `,
    [userId, postId]
  );
  return likeData;
};

const likePost = async (userId, postId) => {
  await dataSource.query(
    `INSERT INTO likes(
            user_id,
            post_id
            ) VALUES (?, ?);
        `,
    [userId, postId]
  );
};

const cancelLikePost = async (userId, postId) => {
  await dataSource.query(
    `DELETE
        FROM likes l
        WHERE l.user_id = ? and l.post_id = ?
        `,
    [userId, postId]
  );
};

module.exports = { getUserId, checkLikePost, likePost, cancelLikePost };
