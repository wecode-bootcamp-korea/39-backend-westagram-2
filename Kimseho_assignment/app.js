require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataSource } = require("typeorm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const header = {
  typ: "JWT",
  alg: "HS256",
};
const payLoad = { foo: "bar" };
const database = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
const secretKey = process.env.secretKey;
let saltRounds = process.env.saltRounds;

database.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [checkUser] = await database.query(
      `SELECT 
        email,
        password
    FROM users
    WHERE email = ?`,
      [email]
    );

    const checkHash = (password, hashedPassword) => {
      return bcrypt.compare(password, hashedPassword);
    };

    if (await checkHash(password, checkUser["password"])) {
      const jwtToken = jwt.sign(payLoad, checkUser["password"]);
      return res.status(201).json({ accessToken: jwtToken });
    } else {
      return res.status(404).json({ message: "Invalid User" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "email wrong" });
  }
});

app.post("/user/signup", async (req, res, next) => {
  const { name, email, password, profile_image } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await database.query(
    `INSERT INTO users(
          name,
          email,
          password,
          profile_image)
      VALUES (?,?,?,?);
    `,
    [name, email, hashedPassword, profile_image]
  );

  res.status(201).json({ message: "userCreated!" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [checkUser] = await database.query(
      `SELECT
        id, 
        email,
        password
    FROM users
    WHERE email = ?`,
      [email]
    );

    await database.query(
      `INSERT INTO posts(
        user_id,
        posting_title,
        posting_content,
        posting_imgUrl)
    VALUES (?,?,?,?);`,
      [decoded["id"], posting_title, posting_content, posting_imgUrl]
    );

    res.status(201).json({ message: "postCreated!" });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid Accses Token" });
    } else if (err.name == "SyntaxError") {
      res.status(400).json({ message: "Syntax Error" });
    }
  }
});

app.post("/postlike/:postId/:userId", async (req, res, next) => {
  const { userId, postId } = req.params;

  let [checkLike] = await database.query(
    `SELECT id,
        user_id,
        post_id
    FROM likes
    WHERE user_id =? AND post_id =?`,
    [userId, postId]
  );

  if (checkLike == undefined) {
    await database.query(
      `INSERT INTO likes(
          user_id,
          post_id)
      VALUES (?,?)`,
      [userId, postId]
    );
    res.status(201).json({ message: "likeCreated" });
  } else {
    await database.query(
      `DELETE FROM likes
      WHERE id = ${checkLike.id}`
    );
    res.status(201).json({ message: "likeDeleted" });
  }
});

app.patch("/post/:postId", async (req, res, next) => {
  const { postId } = req.params;
  const { postingTitle, postingContent, postingImg } = req.body;
  const { headers } = req;
  const decoded = jwt.verify(req.headers.authorization, secretKey);

  await database.query(
    `UPDATE posts
    SET
        posting_title = ?,
        posting_content = ?,
        posting_imgUrl = ?
    WHERE id = ?`,
    [postingTitle, postingContent, postingImg, postId]
  );

  const rows = await database.query(
    `SELECT
        users.id AS userId,
        users.profile_image AS userProfileImage,
        posts.id AS postingId,
        posts.posting_imgUrl AS postingImageUrl,
        posts.posting_content AS postingContent
      FROM users
      LEFT JOIN posts ON posts.user_id = users.id
      WHERE posts.id =?`,
    [postId]
  );

  res.status(201).json({ data: rows });
});
app.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  await database.query(
    `DELETE FROM posts
    WHERE posts.id = ?`,
    [postId]
  );
  res.status(200).json({ message: "postingDeleted" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
