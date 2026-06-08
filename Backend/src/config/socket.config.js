const {Server} = require("socket.io")

// storing io instance
let io

// creating the socket.io server
const initSocket = (server) =>{
    // creating socket.io server and attaching it to our http server
    io = new Server(server, {
        cors:{
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            methods: ["GET","POST"]
        }
    })

    //runs whenever a client connects to socket server
    io.on("connection",(socket) => {
        console.log(`Socket connected: ${socket.id}`)

        //  listen for a custom event "join"
        // frontend will emit this event after interviewer logs in
        socket.on("join",(interviewerId) => {
            socket.join(interviewerId)
            console.log(`Interviewer ${interviewerId} join4d their room`)
        })
        // runs whenever client disconnects
        socket.on("disconnect",() =>{
            console.log(`Socket disconnected: ${socket.id}`)
        })
    })
    return io
}

// getter function to access io instance anywhere in the app 
// without passing it as a parameter
const getIO = () => {
    if(!io){
        throw new Error("Socket.io is not initialized")
    }
    return io
}

module.exports = {initSocket, getIO}