const http = require('http'); 
const express =require("express");
const cors =require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
//import dotenv from 'dotenv'
//import express from 'ecpress'
//import {datasource} from 'typeorm' 설정추가가 필요함 구버전에 사용이 안되는 경우가 있다.
//const  {datasource} = require('typeorm') 이거쓰다가 타입스크립트로 넘어가는게 낫다.
//dotenv.config();

dotenv.config()//환경변수보다 아래에 놓았을때 어떤 에러가 나는지 확인해보기.

const {dataSource, DataSource} = require('typeorm');
const { runInNewContext } = require('vm');
const myDataSource = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()//외부 시스템과 연동상태라서 비동기적인 형태로 이루어진다.
.then(()=>{
    console.log("Data Source has been initialized!")
})
.catch((err)=>{
    console.error("Error during Data Source initialization", err)
    myDataSource.destroy()
})

app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//dotenv.config()


// app.get("ping",(req,res)=>{
//     res.json({message: "pong"});
// })

//health check
app.get('/ping', function (req, res, next){
    res.status(200).json({message:'pong'});//status(201)로 하면 HTTP/1.1 201 Created가 뜬다.
})

//CREATE books
app.post("/books", async(req,res,next)=>{//books 라는 endpoint targeting을 받아서
    const {title, description, coverImage} =req.body //post라는 http메소드로 들어온 통신을 뒤에있는 async 비동기 함수로서 동작시킬수 있게 arrowfunction화 한것.
//들어온 값을 받아서 구조분해 할당을 받은 내용을 
//console.log(req)

await myDataSource.query( //이거로 메소드를 호출하는것이 더좋다.
    `INSERT INTO books( 
        title,
        description,
        cover_image
    ) VALUES (?,?,?);`,
    [title, description, coverImage] //.query 로sql raw query 문을 도입하기위해서 변수처럼 활용해서 사용 
);

res.status(201).json({message:"sucessfully created"});

})

//get all books
app.get('/books',async (req,res)=>{
    await myDataSource.manager.query( //마이데이터소스안에 있는 매니저 클래스로 접근해서도 sql raw query문을 동작시킬수 있는 쿼리 형태의 메소드를 동작시킬 수 있다.
        `SELECT
        b.id,
        b.title,
        b.description,
        b.cover_image
        FROM books b`
        ,(err,row) =>{
            res.status(200).json(rows);
        })
});

app.post("/authors", async(req,res,next)=>{
    const {first_name, last_name, age} =req.body

app.get('/authors', async(req,res)=>{
    await myDataSource.manager.query(
        `INSERT INTO authors(
        first_name,
        last_name,
        age
        )VALUES (?,?,?);`,
        [first_name, last_name, age]);

    res.status(200).json({message: "successfully created"});
})
})



app.get('books-with-authors',async (req,res)=>{
    await myDataSource.manager.query(
        `SELECT
        books.id,
        books.title,
        books.description,
        books.cover_image,
        authors.first_name,
        authors.last_name,
        authors.age
        FROM JOIN authors ON ba.author_id = authors.id
        INNER JOIN books ON ba.book_id = books.id`
        ,(err, rows)=>{
                res.status(200).json(rows);
        })
});






const server = http.createServer(app)


const start =async() => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        console.error(err);
    }
};

start()