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
