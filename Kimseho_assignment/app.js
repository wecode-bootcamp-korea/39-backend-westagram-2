require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

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

app.post("/user_signup", async (req, res, next) => {
  const { name, email, password, profile_image } = req.body;

  await myDataSource.query(
    `INSERT INTO users(
          name,
          email,
          password,
          profile_image)
      VALUES (?,?,?,?);
    `,
    [name, email, password, profile_image]
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