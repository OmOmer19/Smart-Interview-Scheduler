// to run a cron job to send interview reminders
// to interviewers before upcoming interviews
const cron = require("node-cron")
const Booking = require("../models/bookingModel")
const {createNotification} = require("../services/notificationService")

// function to start reminder cron job
const startReminderJob = () =>{
    // runs every 5 minutes
    cron.schedule("*/5 * * * *", async() =>{
        try{
            // current time
            const now = new Date()
            // time after 30 minutes
            const in30Minutes = new Date(
                now.getTime() + 30*60*1000
            )
            // getting confirmed bookings
            const upcomingBookings = await Booking.find({
                status: "confirmed"
            }).populate("slot") //populating slot to get actual slot start time

            // checking each booking
            for( let booking of upcomingBookings){
                // skipping if no slot found
                if(!booking.slot) continue

                const slotStart = new Date(booking.slot.startTime)

                // checking if interview starts within 30 mins
                if(slotStart >= now && slotStart<= in30Minutes){
                    // sending reminder notification
                    await createNotification(
                        booking.interviewer,
                        `Reminder: Interview with ${booking.candidateName} starts in 30 minutes`,
                        "reminder",
                        booking._id
                    )
                }
            }
        }
        catch(err) {
            console.error("Reminder job failed", err.message)
        }
    })
} 
module.exports = {startReminderJob}