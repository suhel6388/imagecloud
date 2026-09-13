
require("dotenv").config()
const mongoose  =  require("mongoose")



async function connectDB(){
    await mongoose.connect(process.env.MONGOOSE_URI)
    console.log('Connected to db');

    
}
module.exports = connectDB