// to run a daily cron job to generate interview slots
// for all interviewers so availability stays updated

const cron = require("node-cron")
const User = require("../models/userModel")
const {generateSlotsForInterviewer} = require("../services/slotService")

// function to start slot generation cron -job at every day 12:00 am
const startSlotGenerationJob = () =>{
    // runs every day at 12:00 am(midnight)
    cron.schedule("0 0 * * *", async() => {
        // loggin
        console.log("Running daily slot generation job..")
        
        try{
            // getting all interviewers from db
            const interviewers = await User.find({})
            // generating slots for each interviewer one by one
            for(let interviewer of interviewers){
                await generateSlotsForInterviewer(interviewer._id)
            }
            console.log("Daily slot generation completed")
        }
        catch(err){
            console.error("Slot generation job failed:", err.message)
        }
    })
}
module.exports = {startSlotGenerationJob}