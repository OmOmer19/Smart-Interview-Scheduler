const express = require("express")
const router = express.Router()

const {bookSlot, getInterviewerBookings, getCandidateBookings, cancelBooking, rescheduleBooking} = require("../controllers/bookingController")
const authMiddleware = require("../middleware/authMiddleware")

// public route for candidate booking
router.post("/", bookSlot)

// private route for getting interviewer bookings
router.get("/interviewer", authMiddleware, getInterviewerBookings)

//public route for candidate booking lookup
router.get("/candidate/:email",getCandidateBookings)

// route to cancel booking + release slot
router.put("/cancel/:bookingId", cancelBooking)

// route to reschedule booking 
router.put("/reschedule/:bookingId", rescheduleBooking)

module.exports = router