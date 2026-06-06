const express = require("express")
const router = express.Router()

const {getAvailableSlots} = require("../controllers/slotController")

// public route - get available slots for interviewer
router.get("/:interviewerId", getAvailableSlots)

module.exports = router