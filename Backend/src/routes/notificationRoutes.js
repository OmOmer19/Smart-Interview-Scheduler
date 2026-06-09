const express = require("express")
const router = express.Router()

//imoorting controller 
const {getNotifications, markAsRead, markAllAsRead} = require("../controllers/notificationController")
// importing auth middleware
const authMiddleware = require("../middleware/authMiddleware")

// protected  routes

// route to get all notification + unread count 
router.get("/", authMiddleware, getNotifications)

// to mark a single notification as read
router.patch("/:notificationId/read",authMiddleware, markAsRead)

// to mark all as read 
router.patch("/read-all", authMiddleware, markAllAsRead)

module.exports = router