const express = require("express")
const router = express.Router()

const {bookSlot} = require("../controllers/bookingController")

// public route for candidate booking
router.post("/", bookSlot)

module.exports = router