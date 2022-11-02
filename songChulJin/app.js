// Built-in package
const http = require("http");

// 3rd-party package
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const {appendFile} =  require("fs")
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        Console.error("Error during Data Source initialization", err)
    myDataSource.destroy()
    })

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev')); 

app.get("/ping", (req,res) => {
    res.json({ message : "pong" });
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
