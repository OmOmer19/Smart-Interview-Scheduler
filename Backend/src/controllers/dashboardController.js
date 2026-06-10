// to get dashboard stats for interviewer
const mongoose = require("mongoose")
const Booking = require("../models/bookingModel")
const Slot = require("../models/slotModel")

// function to get stats for interviewer
const getStats = async(req, res) => {
    try{
        // getting interviewer id from jwt middleware
        const interviewerId = req.user.id
        //calculating start and end of current month
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(),1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // all time slot counts by status
        const allTimeSlots = await Slot.aggregate([
            //filtering slots belonging to this interviewe only
            { $match: {interviewer: new mongoose.Types.ObjectId(interviewerId)}},
            //grouping by status and counting each
            { $group: {_id: "$status", count : { $sum: 1}}}
        ])
        // current month slot counts by status
        const monthSlots = await Slot.aggregate([
            // filtering by interviewer and curr month
            { $match: {
                interviewer:new mongoose.Types.ObjectId(interviewerId),
                createdAt: {$gte: startOfMonth, $lte: endOfMonth}
            }},
            { $group: {_id: "$status", count: {$sum: 1} } }
        ])
        // helper function to format result (aggregate array into readable object)
        const formatStats = (arr) => {
            const result = { available: 0, booked: 0, completed: 0, cancelled: 0}
            arr.forEach(item => {
                result[item._id] = item.count
            })
            return result
        }
        return res.status(200).json({
            message: "Stats fetched successfully",
            allTime: formatStats(allTimeSlots),
            currentMonth: formatStats(monthSlots)
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

// function to get upcoming booking for next 7 days
const getUpcomingBookings = async(req,res) =>{
    try{
        // getting interviewer if from jwt auth middware
        const interviewerId = req.user.id

        // calculating 7 days from now
        const now = new Date()
        const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        // fetching confirmed bookings within next 7 days
        const bookings = await Booking.find({
            interviewer: interviewerId,
            status: "confirmed"
        })
        .populate({
            path: "slot",
            // only returning slots within next 7 days
            match: {startTime: {$gte: now, $lte: next7Days}}
        })
        .sort({ createdAt: 1}) //earliest first

        // filtering bookings where slot didnt match the date range
        const upcomingBookings = bookings.filter(b => b.slot !== null)

        return res.status(200).json({
            message: "Upcoming bookings fetched successfully",
            count: upcomingBookings.length,
            bookings: upcomingBookings
        })
    }
    catch(err){
        return res.status(500).json({message: err.message})
    }
}

// function to get all past bookings for interviewer
const getPastBookings = async(req,res) =>{
    try{
        // getting interviewer id from jwt auth middleware
        const interviewerId = req.user.id

        const now = new Date()

        // fetching bookings whose slot start time has already passed
        const bookings = await Booking.find({
            interviewer: interviewerId
        })
        .populate({
            path: "slot",
            // only slots in the past
            match: {startTime: {$lt: now}}
        })
        .sort({createdAt: -1}) // latest first

        // filtering out bookings where slot didnt match
        const pastBookings = bookings.filter(b => b.slot !== null)

        return res.status(200).json({
            message: "Past bookings fetched successfully",
            count: pastBookings.length,
            bookings: pastBookings
        })
    }
    catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// function to mark a booking as completed or not show

module.exports = {getStats,getUpcomingBookings, getPastBookings}