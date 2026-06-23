const Slot = require("../models/slotModel")
const Booking = require("../models/bookingModel")
const crypto = require("crypto")
const User = require("../models/userModel")

//importing calender services
const { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = require("../services/calendarService")

// importing gmail services
const {sendBookingConfirmationToCandidate,sendBookingConfirmationToInterviewer,
      sendCancellationToCandidate, sendCancellationToInterviewer,
      sendRescheduleConfirmationToCandidate,sendRescheduleConfirmationToInterviewer
      } = require("../services/gmailService")

const {createNotification} = require("../services/notificationService")


// function to book a slot
const bookSlot = async(req,res) =>{
    try{
        // getting req data
        const {slotId, candidateName, candidateEmail, note } = req.body
        if (!slotId || !candidateName || !candidateEmail) {
            return res.status(400).json({
                message: "provide all fields"
            })
        }
        
        // locking the slot if it is available
        const slot = await Slot.findOneAndUpdate(
            {_id: slotId, status: "available"},
            { $set: {status: "booked"}},
            {returnDocument: "after" }
        )
        // if slot not found or already booked
        if(!slot){
            return res.status(400).json({
                message: "Slot already booked or unavailable"
            })
        }
        // generating secure action token ( for cancel/reschedule later)
        const actionToken = crypto.randomBytes(32).toString("hex")

        // creating booking record in db
        const booking = await Booking.create({
            slot: slot._id,
            interviewer: slot.interviewer,
            candidateName,
            candidateEmail,
            note: note || "",
            actionToken
        })
        // creating google calender event after booking success
        const interviewer = await User.findById(slot.interviewer)

        const calendarEvent = await createCalendarEvent(
            interviewer,
            candidateEmail,
            candidateName,
            slot.startTime,
            slot.endTime
        )
        // updating boooking with calender event id
        booking.calendarEventId = calendarEvent.id
        // saving 
        await booking.save()
        
        // sending confirmation emails to both candidate and interviewer
        // using promise.all to send both emails simultaneously
        Promise.all([
            sendBookingConfirmationToCandidate(interviewer,booking, slot),
            sendBookingConfirmationToInterviewer(interviewer, booking, slot)
        ])
        .catch(err => console.error("Booking email failed:", err.message))

        // sending real time notification to interviewer
        /// new_booking type so frontend show correct icon
        await createNotification(
            slot.interviewer,
            `New booking by ${candidateName}`,
            "new_booking",
            booking._id
        )

        //sending res
        return res.status(201).json({
            message: "Slot booked successfully",
            booking
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

// function to get all bookings for interviewer
const getInterviewerBookings = async(req,res) =>{
    try{
        // interviewer id from jwt middleware
        const interviewerId = req.user.id
        // fetching all the bookings for interviewer
        const bookings = await Booking.find({
            interviewer: interviewerId
        })
        .populate("slot") //optional: get slot details
        .sort({createdAt: -1}) // latest first

        return res.status(200).json({
            message: "Interviewer bookings fetched successfully",
            count: bookings.length,
            bookings
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

// function to get bookings by candidate email
const getCandidateBookings = async (req, res) => {
    try{
        const {email} = req.params
        if(!email){
            return res.status(400).json({
                message: "Email is required"
            })
        }
        // fetching bookings for candidate
        const bookings = await Booking.find({
            candidateEmail: email
        })
        .populate("slot")
        .sort({createdAt: -1}) //latest first

        return res.status(200).json({
            message: "Candidate bookings fetched successfully",
            count: bookings.length,
            bookings
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

// function to get single booking by id
const getBookingById = async (req, res) => {
    try{
        const {bookingId} = req.params
        // populating slot to get time details
        const booking = await Booking.findById(bookingId).populate("slot")
        if(!booking){
            return res.status(404).json({message: "Booking not found"})
        }
        return res.status(200).json({ booking })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// function to cancel book and release slot
const cancelBooking = async(req,res) =>{
    try{
        // getting booking id from req params
        const {bookingId} = req.params
        // finding booking
        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }
        //  preventing double cancellation
        if(booking.status === "cancelled"){
            return res.status(400).json({
                message: "Booking already cancelled"
            })
        }
        // updating booking status
        booking.status = "cancelled"
        await booking.save()

        // getting interviewer
        const interviewer = await User.findById(booking.interviewer)

        // fetching slot details for email
        const slot = await Slot.findById(booking.slot)

        // removing google calendar event using service function
        await deleteCalendarEvent(
            interviewer,
            booking.calendarEventId
        )

        // releasing the slot
        await Slot.findByIdAndUpdate(
            booking.slot,
            {$set: {status: "available"}}
        )

        // sending cacellation emails to both candidate and interviewe
        Promise.all([
            sendCancellationToCandidate(interviewer, booking, slot),
            sendCancellationToInterviewer(interviewer, booking, slot)
        ]).catch(err => console.error("Cancellation email failed:", err.message))

        // notifying interviewer about cancellation in real time
        await createNotification(
            booking.interviewer,
            `Booking cancelled by ${booking.candidateName}`,
            "cancellation",
            booking._id
        )

        // sending res
        return res.status(200).json({
            message: "Booking cancelled successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

// function to reschedule booking
const rescheduleBooking = async (req, res) =>{
    try{
        // getting booking id and new slotid
        const {bookingId} = req.params
        const {newSlotId} = req.body

        if(!newSlotId){
            return res.status(400).json({
                message: "New slot id is required"
            })
        }
        // finding booking
        const booking = await Booking.findById(bookingId)
        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            })
        }
        // storing old slot before changing
        const oldSlotId = booking.slot
        // locking new slot automatically
        const newSlot = await Slot.findOneAndUpdate(
            {
                _id: newSlotId,
                status: "available"
            },{
                $set:{ status: "booked"}
            },{
                returnDocument: "after" 
            }
        )
        // if no new slot available
        if(!newSlot){
            return res.status(409).json({
                message: "Selected slot is unavailable"
            })
        }
        // releasing old slot
        await Slot.findByIdAndUpdate(oldSlotId,
            {$set:
                { status: "available"}
            }
        )
        // updating booking
        booking.slot = newSlot._id
        booking.status = "rescheduled"
        // saving booking
        await booking.save()

        // getting interviewer
        const interviewer = await User.findById(booking.interviewer)

        // updating google calander event
        await updateCalendarEvent(
            interviewer,
            booking.calendarEventId,
            newSlot
        )

        // sending reschedule emails to both candidate and interviewer
        Promise.all([
            sendRescheduleConfirmationToCandidate(interviewer, booking, newSlot),
            sendRescheduleConfirmationToInterviewer(interviewer, booking, newSlot)
        ]).catch(err => console.error("Reschedule email failed:", err.message))

        // sending notification to interviewer about reschedule in real time
        await createNotification(
            booking.interviewer,
            `Booking rescheduled by ${booking.candidateName}`,
            "reschedule",
            booking._id
        )

        //sending res
        return res.status(200).json({
            message: "Booking rescheduled successfully",
            booking
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {bookSlot, getInterviewerBookings, getCandidateBookings,
                  getBookingById, cancelBooking, rescheduleBooking
                }