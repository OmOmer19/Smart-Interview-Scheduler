const express = require("express")
const cors = require("cors")
const http = require("http") // to create http server
require("dotenv").config()

//importing configs
const connectToDB = require("./config/mongodb.config")
const passport = require("./config/passport.config")
const {initSocket} = require("./config/socket.config")

// importing cron jobs
const {startSlotGenerationJob} = require("./jobs/slotGeneration.job")
const {startReminderJob} = require("./jobs/reminder.job")

const app = express()

//middlewares

app.use(cors())  //enabling cors
app.use(express.json())
app.use(passport.initialize()) // initializing passport

//importing routes
const authRoutes= require("./routes/authRoutes")
const availabilityRoutes = require("./routes/availabilityRoutes")
const slotRoutes = require("./routes/slotRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")

//using routes
app.use("/api/auth",authRoutes)
app.use("/api/availability", availabilityRoutes)
app.use("/api/slots", slotRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/notifications",notificationRoutes)
app.use("/api/dashboard", dashboardRoutes)

//test route
app.get("/",(req,res) =>{
    res.status(200).json({message:"Smart Interview Scheduler API Running"})
})

//creating http server
const server = http.createServer(app)

//attaching socket.io to http server 
initSocket(server)

const PORT = process.env.PORT || 3000

// main function to start the server
const startServer = async() => {
    // establishing mongodb connection
    await connectToDB()
    // start listening for requests
    server.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
    // starting cron jobs after server is ready
    startSlotGenerationJob() // runs daily at midnight
    startReminderJob()  // runs every 5 mins
}
// starting the server
startServer()