require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt =require("bcrypt");
const jwt = require("jsonwebtoken");

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
.then(()=>{
    console.log("Data Source has been initialized!")
})
.catch((err)=>{
    console.error("Error during Data Source initialization",err)
    appDataSource.destroy()
})

app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))


app.get("/ping",(req, res, next)=>{
    res.status(200).json({message:'pong'})
})


app.post('/users',async (req ,res,next)=>{
    const {name, email, profile_image, password } =req.body

    await appDataSource.query(
        `INSERT INTO users(
            name,
            email,
            profile_image,
            password
        ) VALUES ( ?, ?, ?, ?);
        `,[name, email, profile_image, password]
    );
    res.status(201).json({message:"userCreated"})
})


app.post('/posts',async(req, res, next)=>{
    const {title, content, user_id,image_url} =req.body
    
    await appDataSource.query(
        `INSERT INTO posts(
            title,
            content,
            user_id,
            image_url
        ) VALUES (?,?,?,?);`
    ,[title, content, user_id, image_url]
    );
    res.status(201).json({message: "postCreated"})
})


app.get('/posts/userId', async(req, res)=>{
    
    await appDataSource.query(
    `SELECT
        u.id as userId,
        u.profile_image as userProfileImage,
        p.user_id as postingId,
        p.image_url as postingImageUrl,
        p.content as postingContent
    FROM users u
    INNER JOIN posts p ON u.id = p.user_id;
    `,(err, rows) => {
        res.status(200).json(rows);
    });
    });


app.get('/posts/:userId', async (req , res)=>{
    const {userId} = req.params
    
    try {
        const [result] = await appDataSource.query(
        `SELECT
            u.id userId,
            u.profile_image userProfileImage,
        JSON_ARRAYAGG(
            JSON_OBJECT(
            "postingId", p.id,
            "postingImageUrl", p.image_url,
            "postingContnet", p.content)  
        ) as postings
        FROM users u 
        JOIN posts p ON p.user_id = u.id
        WHERE u.id = ${userId}
        GROUP BY u.id`
        );
        return res.status(200).json({ data: result });
    } catch (err) {
        return res.status(401).json({ error: 'invalid input' });
    }
    });


app.put('/posts/:postId', async(req,res)=>{
    const {title, content, image_url} =req.body
    const { postId } = req.params
    
    try{
    await appDataSource.query(
        `UPDATE posts
        SET 
            title= ?,
            content= ?,
            image_url= ?
        WHERE id= ${postId}
            `, [title, content, image_url]
    );
    const [result] = await appDataSource.query(
        `SELECT
            u.id userId,
            u.name userName,
            p.id postingId,
            p.title postingTitle,
            p.content postingContent
        FROM users u
        JOIN posts p ON u.id = p.user_id
        WHERE p.id =${postId}
        `
    );
    
    res.status(200).json({data: result});
    }catch (err){
        return res.status(401).json({"message": "invalid input"})
    }
});


app.delete('/posts/:postId', async(req,res)=>{
    const {postId} = req.params;
    
    await appDataSource.query(
        `DELETE 
        FROM posts
        WHERE posts.id = ${postId}
        `);
        res.status(204).json({message: "postingDeleted"})
})


app.post('/likes', async(req, res)=>{
    const {userId, postId} =req.body;

    try {
        await appDataSource.query(
            `INSERT INTO likes(
                user_id,
                post_id
            )VALUES(?,?)
            `, [userId, postId]
        );
        res.status(201).json({message : "like created!"})
    }catch (err) {
        res.status(401).json({error : "like failed"})
    }
    })



const server = http.createServer(app)

const start = async() => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on  ${PORT}`));
    } catch (err){
        console.error(err);
    }
};

start()