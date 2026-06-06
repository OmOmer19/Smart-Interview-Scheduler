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
module.exports = {bookSlot}