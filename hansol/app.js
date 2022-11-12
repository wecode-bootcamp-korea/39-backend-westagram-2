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

// app.get('/users', async (req, res) => {
//   await dataSource.query(
//     `SELECT
//         users.name,
//         users.email,
//         users.password
//     FROM users`,
//     (err, rows) => {
//       res.status(200).json(rows);
//     }
//   );
// });

// app.get('/posts', async (req, res) => {
//   await dataSource.query(
//     `SELECT
//         users.id AS userId,
//         users.profile_image AS userProfileImage,
//         posts.id AS postingId,
//         posts.title AS potingTitle,
//         posts.image_url AS postingImageUrl,
//         posts.content AS postingContent
//     FROM users
//     LEFT JOIN posts ON users.id = posts.user_id
//     `,
//     (err, rows) => {
//       res.status(200).json(rows);
//     }
//   );
// });

// app.get('/posts/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const [result] = await dataSource.query(
//       `SELECT
//           u.id userId,
//           u.profile_image userProfileImage,
//           JSON_ARRAYAGG(
//             JSON_OBJECT(
//               "postingId", p.id,
//               "postingImageUrl", p.image_url,
//               "postingContnet", p.content)
//           ) as postings
//       FROM users u
//       JOIN posts p ON p.user_id = u.id
//       WHERE u.id = ${userId}
//       GROUP BY u.id`
//     );
//     return res.status(200).json({ data: result });
//   } catch (err) {
//     return res.status(409).json({ error: 'invalid input' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const checkHash = (p, hashedPassword) => bcrypt.compare(p, hashedPassword);

//   const login = async () => {
//     const [result] = await dataSource.query(
//       `SELECT
//           users.id,
//           users.name,
//           users.email,
//           users.password
//       FROM users
//       WHERE email = ?
//       `,
//       [email]
//     );

//     const check = await checkHash(password, result.password);
//     const payLoad = { payLoad: result.id };
//     const jwtToken = jwt.sign(payLoad, secretKey);

//     if (check === true) {
//       res.cookie('Token', `${jwtToken}`);
//       res.status(200).json({ accessToken: jwtToken });
//     } else {
//       res.status(401).json({ message: 'Invalid User' });
//     }
//   };

//   login();
// });

// app.post('/posts', async (req, res) => {
//   const { title, content } = req.body;

//   const post = async () => {
//     if (req.decoded) {
//       await dataSource.query(
//         `INSERT INTO posts(
//           title,
//           content,
//           user_id
//       ) VALUES (?, ?, ?);
//       `,
//         [title, content, req.decoded.payLoad]
//       );
//       res.status(201).json({ message: 'postCreated' });
//     } else {
//       res.status(401).json({ message: 'invalid input' });
//     }
//   };
//   post();
// });

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

// app.delete('/posts/:postId', async (req, res) => {
//   const { postId } = req.params;
//   await dataSource.query(
//     `DELETE
//     FROM posts p
//     WHERE p.id = ${postId}
//     `
//   );
//   res.status(204).json({ message: 'postingDeleted' });
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
