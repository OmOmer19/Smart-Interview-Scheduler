const Slot = require("../models/slotModel")
const Booking = require("../models/bookingModel")
const crypto = require("crypto")

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
            {new: true}
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
        const {email} = req.query
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

// function to cancel book and release slot
const cancelBooking = async(req,res) =>{
    try{
        // getting booking id from req params
        const {bookingId} = req.params
        // finding booking
        const booking = await Booking.findById({bookingId})
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

        // releasing the slot
        await Slot.findByIdAndUpdate(
            booking.slot,
            {$set: {status: "available"}}
        )
        // sending res
        return res.status.json({
            message: "Booking cancelled successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}

module.exports = {bookSlot, getInterviewerBookings, getCandidateBookings, cancelBooking}