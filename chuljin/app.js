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

const postArr = rows => {
    for(let i=0; i<rows.length; i++){
        delete rows[i].userId;
        delete rows[i].userProfileImage;
    }
    return rows;
}

app.get("/ping", (req,res) => {
    res.json({ message : "pong" });
})

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

app.post("/posts/signup", async(req, res, next) => {
    const { title, content, imageUrl, userId } = req.body;

    await appDataSource.query(
        `INSERT INTO posts(
            title,
            content,
            image_url,
            user_id
        ) VALUES ( ?, ?, ?, ? );
        `, [title, content, imageUrl, userId]
    );

    res.status(201).json({ message : "postCreated"});
})

app.get("/posts/lookup", async(req, res, next) => {
    await appDataSource.manager.query(
        `SELECT 
                users.id as userId, 
                users.profile_image as userProfileImage, 
                posts.id as postingId, 
                posts.image_url as postingImageUrl, 
                posts.content as postingContent 
            FROM users 
            INNER JOIN posts 
            ON users.id = posts.user_id
        `, (err, rows) => {
            res.status(200).json({ "data" : rows });
        });
})

app.get("/users/posts/lookup/:id", async(req, res, next) => {
    const { id } = req.params;
    
    await appDataSource.manager.query(
        `SELECT 
                users.id as userId, 
                users.profile_image as userProfileImage, 
                posts.id as postingId, 
                posts.image_url as postingImageUrl, 
                posts.content as postingContent 
            FROM users 
            INNER JOIN posts 
            ON users.id = posts.user_id 
            WHERE users.id = ${id}; 
        `, 
        (err, rows) => { 
            //console.log(rows);
            let postings
            res.status(200).json(
                { "data" : {
                        "userId" : rows[0].userId, 
                        "userProfileImage" : rows[0].userProfileImage,
                        "postings" : postArr(rows)
                    }
                });
        });
})

app.patch("/posts/update/:userId/:postId", async(req, res, next) => {
    const { userId, postId } = req.params;
    const { content } = req.body;
    await appDataSource.manager.query(
        ` UPDATE 
                posts 
            SET content=? 
            WHERE user_id=${userId} and id=${postId};
        `, [content]
    );

    await appDataSource.manager.query(    
        `SELECT 
                users.id as userId, 
                users.name as userName, 
                posts.id as postingId, 
                posts.title as postingTitle, 
                posts.content as postingContent 
            FROM users 
            INNER JOIN posts 
            ON users.id = posts.user_id
            WHERE users.id=${userId} and posts.id=${postId};
        `, (err, rows) => { 
            console.log(rows)
            res.status(200).json({"data" : rows});
    });
})

app.delete("/posts/delete/:id", async(req, res, next) => {
    const { id } = req.params;
    await appDataSource.query(
        `DELETE 
            FROM posts
            WHERE id=${id}; 
        `, (err, rows) => {
            res.status(204).end();
        }
    );    
})

app.post("/likes/:userId/:postId", async(req, res, next)=>{
    const { userId, postId } = req.params;

    await appDataSource.query(
        `INSERT INTO likes(
            user_id, 
            post_id
        ) VALUES (${userId}, ${postId});
        ` );
    res.status(200).json({ message : "likeCreated" });
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
