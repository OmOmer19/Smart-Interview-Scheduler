const Slot = require("../models/slotModel")

// function to get availablle slots
const getAvailableSlots = async(req,res) =>{
    try{
        // getting interviewer id
        const {interviewerId} = req.params
        //fetching only available future slots
        const slots = await Slot.find({
            interviewer: interviewerId,
            status: "available",
            startTime: {$gte: new Date()} // only future slots
        }).sort({startTime: 1}) //sorting in ascending

        // returning res
        return res.status(200).json({
            message: "Available slots fetched successfully",
            count: slots.length,
            slots
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {getAvailableSlots}