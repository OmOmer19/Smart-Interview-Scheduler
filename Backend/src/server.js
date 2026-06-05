const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectToDB = require("./config/mongodb.config")
const passport = require("./config/passport.config")

const app = express()

app.use(express.json())

// initializing passport
app.use(passport.initialize())

connectToDB()

const authRoutes= require("./routes/authRoutes")

app.use("/api/auth",authRoutes)

app.get("/",(req,res) =>{
    res.status(200).json({message:"Smart Interview Scheduler API Running"})
})

const PORT = process.env.PORT || 3000

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
})