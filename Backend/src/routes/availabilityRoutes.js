const express = require("express")
const router = express.Router()

const {createAvailability} = require("../controllers/availabilityController")
//jwt middleware
const authMiddleware = require("../middleware/authMiddleware")

// protected route to create availability 
router.post("/",authMiddleware,createAvailability)

module.exports = router