require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { DataSource } = require('typeorm');

const dataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    dataSource.destroy()
    })

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev')); 

app.get("/ping", (req,res) => {
    res.status(200).json({ message : "pong" });
})

app.post("/users/signup", async(req, res, next) => {
    const { name, email, profileImage, password } = req.body

    await dataSource.query(
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

app.post("/posts", async(req, res, next) => {
    const { title, content, imageUrl, userId } = req.body;

    await dataSource.query(
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

app.get("/posts", async(req, res, next) => {
    await dataSource.query(
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

app.get("/posts/userId/:userId", async(req, res, next) => {
    const { userId } = req.params;

    const data = await dataSource.query(
        `SELECT 
            users.id as userId,
            users.profile_image as userProfileImage,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                "postingId",posts.id,
                "postingImageUrl", posts.image_url,
                "postingContent",posts.content
                )
            ) as postings 
            FROM users 
            INNER JOIN posts 
            ON users.id = posts.user_id 
            WHERE users.id = ?
            GROUP BY users.id;
        `, [ userId ]
    );
    const result = data.map((el) => ({
        ...el,
        "postings": JSON.parse(el.postings),
    }));
    res.status(200).json(result);
})

app.patch("/posts/:postId/userId/:userId", async(req, res, next) => {
    const { userId, postId } = req.params;
    const { content } = req.body;

    await dataSource.query(
        ` UPDATE 
                posts 
            SET content = ? 
            WHERE user_id = ? and id = ?;
        `, [content, userId, postId]
    );

    const result = await dataSource.query(    
         `SELECT 
                users.id as userId, 
                users.name as userName, 
                posts.id as postingId, 
                posts.title as postingTitle, 
                posts.content as postingContent 
            FROM users 
            INNER JOIN posts 
            ON users.id = posts.user_id
            WHERE users.id = ? and posts.id = ?;
        `,[userId, postId]
    );
    res.status(200).json({"data" : result});
})

app.delete("/posts/:postId", async(req, res, next) => {
    const { postId } = req.params;
    await dataSource.query(
        `DELETE 
            FROM posts
            WHERE id = ?; 
        `, [postId],
    );
    res.status(204).send()    
})

app.post("/likes/userId/:userId/postId/:postId", async(req, res, next)=>{
    const { userId, postId } = req.params;
    const [ isExist ] = await dataSource.query(
        `SELECT EXISTS(
            SELECT *
                FROM likes
                WHERE user_id = ? and post_id = ? 
        ) AS isExist;`
        , [userId, postId]
    );

    if(isExist.isExist === "1"){        
        await dataSource.query(
            `DELETE 
                FROM likes
                WHERE user_id = ? and post_id = ?; 
            `, [userId, postId] 
        );
        res.status(204).send();  
    }else{
        await dataSource.query(
            `INSERT INTO likes(
                user_id, 
                post_id
            ) VALUES ( ?, ? );
            `, [userId, postId] );
        res.status(201).json({ message : "likeCreated" });
    }
})

const PORT = process.env.PORT;

const start = async () => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
}
start();
