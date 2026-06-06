// here we will genrate slot based on availability

const Slot = require("../models/slotModel")
const Availability = require("../models/availabilityModel")

// function to get date range(next 30 days)
const getNextDays = (n) =>{
    const dates = []
    const today = new Date()

    for(let i=0 ;i<n; i++){
        const date = new Date(today)
        //moving fate forward by i days
        date.setDate(today.getDate() + i)
        dates.push(date)
    }
    return dates
}

//function to combile date + time string
const combineDateTime = (date,timeString) =>{
    //splitting "HH:MM" into hours and minutes
    const [hours, minutes] = timeString.split(":").map(Number)
    const newDate = new Date(date)

    //setting exact time on the date
    newDate.setHours(hours,minutes,0,0)

    return newDate
}

// main function to generate slots for interviewer
const generateSlotsForInterviewer = async(interviewerId) =>{
    try{
        // getting all availability frules for interviewer
        const rules = await Availability.find({interviewer: interviewerId})
        // if no exist
        if(!rules.length){
            console.log("No availability rules found for interviewer")
            return
        }
        //geting next 30 days range
        const next30Days = getNextDays(30)
        /// storing all slots before saving
        let slotsToCreate = []
        // looping through each rule
        for(let rule of rules){
            const {daysOfWeek, startTime, endTime, duration} = rule
            
            // looping through each day in next 30 days
            for (let date of next30Days){
                // getDay() : 0(sunday) -> 9(saturday)
                const dayOfWeek = date.getDay()

                //skipping if this day is not in availability rule
                if (!daysOfWeek.includes(dayOfWeek)) continue

                //start time for slot generation
                let slotStart = combineDateTime(date, startTime)

                // end limit of availability window
                const slotEndLimit = combineDateTime(date, endTime)

                //creating slots within time range
                while( slotStart < slotEndLimit){
                    // calculating slot end time using duration
                    const slotEnd = new Date(
                        slotStart.getTime() + duration * 60000
                    )
                    // if slot is exceeding availability window, stopping
                    if(slotEnd > slotEndLimit) break

                    //pushing slot into array (not db yet)
                    slotsToCreate.push({
                        interviewer: interviewerId,
                        startTime: slotStart,
                        endTime: slotEnd,
                        status: "available" // initial state
                    })
                    // moving to next slot
                    slotStart = slotEnd
                }
            }
        }
        // saving the slots with duplicate prevention(Idempotent operation)
        for(let slot of slotsToCreate){
            // checking if slot already exist
            const exists = await Slot.findOne({
                interviewer: slot.interviewer,
                startTime: slot.startTime
            })
            // only creating if not already exists
            if (!exists) {
                await Slot.create(slot)
            }
        }
        console.log("Slot generation completed successfully")
    }
    catch(err){
        // Error handling for debugging
        console.error("Slot generation error:", error.message)
    }
}

// exporting service function
module.exports = {generateSlotsForInterviewer}