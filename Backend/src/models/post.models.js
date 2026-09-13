const mongoose = require("mongoose")


const postSchema =  new mongoose.Schema({
    image:String,
    caption:String,
})


const postModel = mongoose.model("post", postSchema)
//all post data store in post collection 

module.exports = postModel
