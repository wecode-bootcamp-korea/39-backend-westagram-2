require('dotenv').config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const {DataSource} = require('typeorm');

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
app = express()

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.get("/ping", (req,res)=> {
    res.status(201).json({message : "pong"})
});

app.post('/books', async (req, res) => {
	const { title, description, coverImage} = req.body
    
	await myDataSource.query(
		`INSERT INTO books(
		    title,
		    description,
		    cover_image
		) VALUES (?, ?, ?);
		`,
		[ title, description, coverImage ]
	); 
     res.status(201).json({ message : "successfully created" });
	})

// Get all books
app.get('/books', async(req,res)=>{
    await myDataSource.query(
        `SELECT
            b.id,
            b.title,
            b.description,
            b.cover_image
          FROM books b`
        ,(err, rows) => {
            res.status(200).json(rows)
        }
    )
});

const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async() => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();