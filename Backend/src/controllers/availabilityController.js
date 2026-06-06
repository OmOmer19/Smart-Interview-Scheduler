const Availability = require("../models/availabilityModel")

// importing slot generation service
const {generateSlotsForInterviewer} = require("../services/slotService")


// to create availability  rule and auto generate slots after creating availability
const createAvailability = async(req,res) =>{
    try{
        // getting data from body
        const { daysOfWeek,startTime,endTime,duration} = req.body

        if(!daysOfWeek || !startTime || !endTime || !duration){
            return res.status(400).json({
                message: "Please provide all the fields"
            })
        }
        // creating availability in db
        const availability = await Availability.create({
            // will get user from auth middleware after authentication and id from there
            interviewer: req.user.id,
            daysOfWeek,
            startTime,
            endTime,
            duration
        })
        // auto geenrating slots using slotservice
        await generateSlotsForInterviewer(req.user.id)
        //sending response
        res.status(201).json({
            message: "Availability created successfully & slots generated successfully",
            availability
        })
    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {createAvailability}