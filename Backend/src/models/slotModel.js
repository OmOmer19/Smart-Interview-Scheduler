const mongoose = require("mongoose")

//slot model - bookable interview slot

const slotSchema = new mongoose.Schema(
    {
        // interviewer who owns this slot
        interviewer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        //start time of slot
        startTime:{
            type: Date,
            required: true
        },
        //end time
        endTime:{
            type: Date,
            required: true
        },
        //slot status
        status:{
            type: String,
            enum: ["available","booked","cancelled","completed"],
            default: "available"
        }
    },
    {
        timestamps: true
    }
)
const Slot = mongoose.model("Slot",slotSchema)
module.exports = Slot