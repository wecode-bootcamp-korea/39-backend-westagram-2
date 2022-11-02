const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const { DataSource } = require('typeorm')

dotenv.config()//환경변수를 사용하기 전에 놔야함 밑으로 가면 에러발생.

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME, 
    password: process.env.TYPEORM_PASSWORD, 
    database: process.env.TYPEORM_DATABASE, 
})

myDataSource.initialize()
    .then(()=>{
        console.log('Data Source has been initialized');
    })
    .catch((err)=> {
        console.error('Error during Data Source initialization', err)
    myDataSource.destroy()
    })


const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
 
app.get('/ping', (req,res)=> {
    res.json({message: 'pong'});
});

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async() => {
    server.listen(PORT, ()=> console.log(`server is listening on ${PORT}`) )
}

start()