require("dotenv").config();

const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { DataSource } = require("typeorm");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const dataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

dataSource
  .initialize()

  .then(() => {
    console.log("Data Source has been initialized");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
    dataSource.destroy();
  });

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/users", async (req, res) => {
  await dataSource.query(
    `SELECT
        users.name,
        users.email,
        users.password
    FROM users`,
    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  await dataSource.query(
    `INSERT INTO users(
        name,
        email,
        password
    ) VALUES (?, ?, ?);
    `,
    [name, email, password]
  );
  res.status(201).json({ message: "userCreated" });
});

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
