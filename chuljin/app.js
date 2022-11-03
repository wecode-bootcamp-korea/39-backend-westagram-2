require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const { appendFile } =  require("fs")
const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        Console.error("Error during Data Source initialization", err)
    appDataSource.destroy()
    })

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev')); 

app.get("/ping", (req,res) => {
    res.json({ message : "pong" });
})

// 유저 회원가입 엔드포인트 구현
app.post("/users/signup", async(req, res, next) => {
    const { name, email, profileImage, password } = req.body

    await appDataSource.query(
        `INSERT INTO users(
            name, 
            email,
            profile_image,
            password
        ) VALUES (?, ?, ?, ?);
        `, [name, email, profileImage, password]
    );

    res.status(201).json({ message : "userCreated"});
})

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
}
start();
