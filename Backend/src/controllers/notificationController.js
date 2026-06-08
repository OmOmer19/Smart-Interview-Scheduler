const Notification = require("../models/notificationModel")

// function to get all notifications for interviewer
const getNotifications = async(req,res) =>{
    try{
        // getting intervieweer if from jwt auth middleware
        const interviewerId = req.user.id

        // fetching all notifications (latest first)
        const notifications = await Notification.find({
            interviewer: interviewerId
        }).sort({ createdAt: -1})

        // counting unread seperately
        const unreadCount = await Notification.countDocuments({
            interviewer: interviewerId,
            isRead: false
        })

        return res.status(200).json({
            message: "Notifications fetched successfully",
            unreadCount,
            count: notifications.length,
            notifications
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

// function to mark a single notification as read
const markAsRead = async(req, res) => {
    try{
        // getting notification if from params
        const {notificationId} = req.params
        // updating isRead to true
        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { $set: {isRead: true}},
            { returnDocument: "after" }
        )
        if(!notification){
            return res.status(404).json({ message: "Notification not found" })
        }
        return res.status(200).json({
            message: "Notification marked as read",
            notification
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

// function to mark all notifications as read in one go
const markAllAsRead = async(req,res) =>{
    try{
        // getting interviewer if from jwt auth middleware
        const interviewerId = req.user.id
        //updating all unread notifications for this interviewer
        await Notification.updateMany(
            { interviewer: interviewerId, isRead: false},
            { $set: {isRead: true}}
        )
        return res.status(200).json({
            message: "All notifications marked as read"
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

module.exports = {getNotifications, markAsRead, markAllAsRead}