const mongoose = require("mongoose")

// notification model - to store all notification for interviewers
const notificationSchema = new mongoose.Schema(
    {
        // which interviewer this notification belongs to
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // notification msg to display
        message: {
            type: String,
            required: true
        },
        // type of notification - it will help frontend show diff icons
        type:{
            type: String,
            enum: ["new_booking","cancellation","reschedule","reminder"],
            required: true
        },
        // reference to the booking this noti is about
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            default: null
        },
        //whether interviewer has read this notification
        // used to show unread count on frontend
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

const Notification = mongoose.model("Notification", notificationSchema)
module.exports = Notification