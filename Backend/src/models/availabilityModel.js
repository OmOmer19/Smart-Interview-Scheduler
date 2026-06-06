const mongoose = require("mongoose")
const { applyTimestamps } = require("./userModel")

// availability rule model
const availabilitySchema = new mongoose.Schema(
    {
    // reference to interviewer
    interviewer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // days of week - 1-monday, 2-tuesday and so on
    daysOfWeek :[
        {type: Number,
         required: true
        }
    ],
    //availability start time
    startTime : {
        type: String,
        required: true
    },
    //availability end time
    endTime : {
        type: String,
        required: true
    },
    // interview duration - in minutes
    duration :{
        type: Number,
        required: true
    }
    },
    {
        timestamps: true
    }
)

const Availability = mongoose.model("Availability", availabilitySchema)

module.exports = Availability