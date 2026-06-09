const express = require("express")
const router = express.Router()

const {getStats, getUpcomingBookings, getPastBookings} = require("../controllers/dashboardController")

// importing auth middleware
const authMiddleware = require("../middleware/authMiddleware")

// protected routes

// to get stats
router.get("/stats", authMiddleware, getStats)

// to get upcoming bookings for next 7 days
router.get("/upcoming", authMiddleware, getUpcomingBookings)

// to get past bookings
router.get("/past", authMiddleware, getPastBookings)

module.exports = router