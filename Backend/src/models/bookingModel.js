const mongoose = require("mongoose")

// booking model
const bookingSchema = new mongoose.Schema(
    {
        //slot being booked
        slot:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Slot",
            required: true
        },
        // interviewer
        interviewer:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        candidateName: {
            type: String,
            required: true
        },
        candidateEmail: {
            type: String,
            required: true
        },
        // optional note for candidate
        note:{
            type: String,
            default: ""
        },
        // booking status lifecycle
        status:{
            type: String,
            enum: ["confirmed", "cancelled", "completed", "rescheduled", "no-show"],
            default: "confirmed"
        },
        // Google Calendar event ID (will be used later)
        calendarEventId: {
            type: String,
            default: null
        },
        // token for secure cacellation/ reschedule links
        actionToken:{
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking