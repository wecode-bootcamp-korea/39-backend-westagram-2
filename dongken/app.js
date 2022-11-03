require('dotenv').config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const util = require('util');



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

app.post('/users/signup', async (req, res) => {
	const { name, email, profile_image, password} = req.body
    console.log(req.header);
    
	await myDataSource.query(
		`INSERT INTO users(
		    name,
		    email,
		    profile_image,
            password
		) VALUES (?, ?, ?, ?);
		`,
		[ name, email, profile_image, password]
	); 
     res.status(201).json({ message : "userCreated" });
	})

 app.post('/posts', async (req, res) => {
	const { title, content, image_url, user_id} = req.body
    
	await myDataSource.query(
		`INSERT INTO posts(
		    title,
		    content,
		    image_url,
            user_id
		) VALUES (?, ?, ?,?);
		`,
		[ title, content, image_url, user_id]
	); 
     res.status(201).json({ message : "postCreated" });
	})

    app.get('/posts/all', async(req, res) => {
        await myDataSource.query(
        `SELECT 
            users.id as userId,
            users.profile_image as userProfileImage,
            posts.id as postingId,
            posts.image_url as postingImageUrl,
            posts.content as postingContent
        FROM posts
        INNER JOIN users ON posts.user_id = users.id`
            ,(err, rows) => {
          res.status(200).json({data : rows});
        });
    });


const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async() => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();