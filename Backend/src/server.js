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
const availabilityRoutes = require("./routes/availabilityRoutes")
const slotRoutes = require("./routes/slotRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

app.use("/api/auth",authRoutes)
app.use("/api/availability", availabilityRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/",(req,res) =>{
    res.status(200).json({message:"Smart Interview Scheduler API Running"})
})

const PORT = process.env.PORT || 3000

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
})