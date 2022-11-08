require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const header = {
  typ: "JWT",
  alg: "HS256",
};
const payLoad = { foo: "bar" };
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [checkUser] = await myDataSource.query(
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
    return res.status(409).json({ message: "email wrong" });
  }
});

app.post("/user/signup", async (req, res, next) => {
  const { name, email, password, profile_image } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await myDataSource.query(
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

app.post("/postup", async (req, res, next) => {
  const { user_id, posting_title, posting_content, posting_imgUrl } = req.body;

  await myDataSource.query(
    `INSERT INTO posts(
        user_id,
        posting_title,
        posting_content,
        posting_imgUrl)
    VALUES (?,?,?,?);
    `,
    [user_id, posting_title, posting_content, posting_imgUrl]
  );

  res.status(201).json({ message: "postCreated!" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
