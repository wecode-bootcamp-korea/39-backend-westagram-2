const http = require('http');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const { DataSource } = require('typeorm');
dotenv.config();

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
    console.log('Data Source has been initialized');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    dataSource.destroy();
  });

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/users', async (req, res) => {
  await dataSource.query(
    `SELECT
            users.name,
            users.email,
            users.password
        from users`,

    (err, rows) => {
      res.status(200).json(rows);
    }
  );
});

app.post('/signup', async (req, res) => {
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
  res.status(201).json({ message: 'userCreated' });
});

app.post('/posts', async (req, res) => {
  const { title, content, user_id } = req.body;

  await dataSource.query(
    `INSERT INTO posts(
        title,
        content,
        user_id
    ) VALUES (?, ?, ?);
    `,
    [title, content, user_id]
  );
  res.status(201).json({ message: 'postCreated' });
});

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();