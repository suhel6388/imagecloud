const express = require('express')
const multer = require("multer")
const uploadFiles = require("./Services/storage.service")
const postModel = require('./models/post.models')
const cors = require('cors')
const app = express()
app.use(cors({
  origin: 'http://localhost:5173', // your Vite dev server
  methods: ['GET', 'POST'],
}))
app.use(express.json())

const uploads = multer({storage:multer.memoryStorage()})


app.post('/create-post',uploads.single("image"), async (req,res)=>{
    console.log(req.body);

    console.log(req.file);
    const result = await uploadFiles(req.file.buffer)
console.log(result);
const post = await postModel.create({
    image:result.url,
    caption:req.body.caption
})

return res.status(201).json({
    message:"Post created successfully!",
    post
})
    
})

app.get("/posts", async(req,res)=>{
    const post = await postModel.find()
    return res.status(200).json({
        message:"Post fetched succesfully!",
        post
    })
})
module.exports = app;



