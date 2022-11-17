require('dotenv').config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {DataSource} = require('typeorm');

const appDateSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

appDateSource.initialize()
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

    const bcryptPassword = bcrypt.hashSync(password,12)
    await appDateSource.query(
		`INSERT INTO users(
		    name,
		    email,
		    profile_image,
            password
		) VALUES (?, ?, ?, ?);
		`,
		[ name, email, profile_image, bcryptPassword]
	); 
     res.status(201).json({ message : "userCreated" });
	})

app.post('/login', async(req, res)=> {
   const {name, password} = req.body
   const matchedUser =  await appDateSource.query(
        `SELECT
         *
         FROM users
         WHERE users.name = '${name}'`)
         
        const checkPassword = await bcrypt.compare(password, matchedUser[0].password)


        if(checkPassword === true){
        const payLoad = {userId : matchedUser[0].id};
        const secretKey = 'mySecretKey';

        const jwtToken = jwt.sign(payLoad, secretKey);

        return res.status(200).json({accessToken: jwtToken})
        } else {
        return  res.status(401).json({message : "Invalid User"})
        }
       
    })
            
         

    
 app.post('/posts', async (req, res) => {
	const { title, content, image_url, user_id} = req.body
    
	await appDateSource.query(
		`INSERT INTO posts(
		    title,
		    content,
		    image_url,
            user_id
		) VALUES (?, ?, ?, ?);
		`,
		[ title, content, image_url, user_id]
	); 
     res.status(201).json({ message : "postCreated" });
	})

app.get('/posts/all', async(req, res) => {
        await appDateSource.query(
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
    
app.get('/posts/:userId', async(req, res) => {
        const {userId} = req.params;
        const [result] = await appDateSource.query(
        `SELECT 
            users.id as userId,
            users.profile_image as userProfileImage,
            post.postings
        FROM users 
        LEFT JOIN (
          SELECT
            user_id,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    "postingId",id,
                    "postingImageUrl", image_url,
                    "postingContent", content 
                )
            ) as postings
          FROM posts
            GROUP BY user_id
        ) post ON post.user_id = users.id
        WHERE users.id = ${userId}`)
            
          res.status(200).json({data : result});
        });

app.patch('/posts/:postId', async(req, res) => {
    const {content} = req.body;
    const {postId} = req.params;

    await appDateSource.query(
        `UPDATE 
            posts
        SET 
        content = ?
        WHERE posts.id = ${postId}`,
        [content]);

    const [result] = await appDateSource.query(
        `SELECT
            users.id as userId,
            users.name as userName,
            posts.id as postingId,
            posts.title as postingTitle,
            posts.content as postingContent
        FROM users INNER JOIN posts ON posts.user_id = users.id
        WHERE posts.id = ${postId}
        `
    )
    console.log(result)
    res.status(201).json({data : result})
    }
)

app.delete('/posts/:postId', async(req, res) => {
    const {postId} = req.params;

    await appDateSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}`)
    
    res.status(200).json({ message : "postingDeleted"});
});

app.post('/likes', async (req, res) => {
	const {user_id, post_id} = req.body
    
	await appDateSource.query(
		`INSERT INTO likes(
		    user_id,
		    post_id
		) VALUES (?, ?);
		`,
		[user_id, post_id]
	); 
     res.status(201).json({ message : "likeCreated" });
	})


    
const server = http.createServer(app)
const PORT = process.env.PORT;

const start = async() => {
    server.listen(PORT, () => console.log(`server is listening on ${PORT}`))
};

start();

