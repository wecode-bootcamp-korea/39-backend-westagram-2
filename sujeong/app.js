const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

//모든 RES에 CORS요청을 설정하는법 
// app.use(cors())
// app.get('/ping', function (req, res, next){
//     res.json({message:'pong'})
// })
// app.listen(3000, function(){
//     console.log('server listening on port 3000')
// })

dotenv.config() //환경변수보다 위에 놓기

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

myDataSource.initialize()
.then(()=>{
    console.log("Data Source has been initialized!")
})
.catch((err)=>{
    console.error("Error during Data Source initialization",err)
    myDataSource.destroy()
})

app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

// app.get("ping", (req, res) =>{
//     res.json({message: "pong"})
// })

//health check
app.get("/ping",(req, res, next)=>{
    res.status(200).json({message:'pong'})
})

// app.post("/users",async(req , res, next)=>{
//     const {name, password} =req.body

//     await myDataSource.query(
//         `INSERT INTO users(
//             name,
//             password
//         )VALUES(?,?,?);`
//         [name, password]
//     );
//     res.status(200).json({message: "userCreated"})
// })


const server = http.createServer(app)

const start = async() => {
    try{
        app.listen(PORT, () => console.log(`Server is listening on  ${PORT}`));
    } catch (err){
        console.error(err);
    }
};

start()