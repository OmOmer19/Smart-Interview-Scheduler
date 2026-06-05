const mongoose = require("mongoose")

const connectToDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")
    }
    catch(err){
        console.log("Mongodb connection failed",err.message)
        //stopping application if db connection fails
        process.exit(1)
    }
}
module.exports = connectToDB