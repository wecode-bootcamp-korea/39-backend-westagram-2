const http = require('http');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { DataSource} = require('typeorm');
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
        ) VALUES ( ?, ?, ?, ?)
        `,[name, email, profile_image, password]
    );
    res.status(201).json({message:"userCreated"})
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