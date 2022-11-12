require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const { dataSource } = require('./src/models/dataSource');
const { router } = require('./src/routes');

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(router);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

const start = async () => {
  const PORT = process.env.PORT;

  await dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      dataSource.destroy();
    });

  app.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();

// app.put('/posts/:postId', async (req, res) => {
//   const { postId } = req.params;
//   const { postingTitle, postingContent, postingUrl } = req.body;
//   try {
//     await dataSource.query(
//       `UPDATE posts
//         SET
//           title = ?,
//           content = ?,
//           image_url = ?
//       WHERE id = ${postId};
//       `,
//       [postingTitle, postingContent, postingUrl]
//     );
//     const [result] = await dataSource.query(
//       `SELECT
//           u.id userId,
//           u.name userName,
//           u.id postingId,
//           p.title postingTitle,
//           p.content postingContent,
//           p.image_url postingUrl
//       FROM users u
//       JOIN posts p ON u.id = p.user_id
//       WHERE p.id = ${postId};
//       `
//     );
//     return res.status(201).json({ data: result });
//   } catch (err) {
//     return res.status(409).json({ message: 'invalid input' });
//   }
// });

// app.post('/likes/:postId/:userId', async (req, res) => {
//   const { postId, userId } = req.params;
//   const [likeData] = await dataSource.query(
//     `SELECT EXISTS(
//       SELECT *
//       FROM likes l
//       WHERE l.user_id = ${userId} AND l.post_id = ${postId}
//       ) AS checkList
//     `
//   );
//   if (Number(likeData.checkList) === 1) {
//     await dataSource.query(
//       `DELETE
//       FROM likes l
//       WHERE l.user_id = ${userId} and l.post_id = ${postId}
//       `
//     );
//     res.status(201).json({ message: 'likeCanceled' });
//   } else {
//     await dataSource.query(
//       `INSERT INTO likes(
//           user_id,
//           post_id
//           ) VALUES (?, ?);
//       `,
//       [userId, postId]
//     );
//     res.status(201).json({ message: 'likeCreated' });
//   }
// });
