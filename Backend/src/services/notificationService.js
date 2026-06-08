const Notification = require("../models/notificationModel")
const {getIO} = require("../config/socket.config")

// function to create notification and emit to interviewer in real time
// this will handle both saving to db and sending via socket

const createNotification = async(interviewerId, message, type, bookingId = null) =>{
    // saving notification to db 
    const notification = await Notification.create({
        interviewer: interviewerId,
        message,
        type,
        booking: bookingId
    })
    // emitting real time notification to interviewer's room
    try{
        //getting socket server
        const io = getIO()

        // sending real time notification
        io.to(interviewerId.toString()).emit("notification", {
            _id: notification._id,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            createdAt: notification.createdAt
        })
    }
    catch(err){
        console.error("Socket emit failed", err.message)
    }
    // returning created notification
    return notification
}

module.exports = {createNotification}