// dashboard service - all dashboard related api calls

import axiosInstance from "../utils/axiosInstance";

// to get stats of logged in interviewer
const getStats = async () =>{
    const response = await axiosInstance.get('/api/dashboard/stats')
    return response.data
}

// to get upcoming bookings for next 7 days
const getUpcomingBookings = async () => {
    const response = await axiosInstance.get('/api/dashboard/upcoming')
    return response.data
}

// to get past bookings
const getPastBookings = async () =>{
    const response = await axiosInstance.get('/api/dashboard/past')
    return response.data
}

export {getStats, getUpcomingBookings, getPastBookings}