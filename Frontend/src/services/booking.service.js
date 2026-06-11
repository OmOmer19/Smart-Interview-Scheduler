// booking service - all booking related api calls
import axiosInstance from "../utils/axiosInstance"

// to book a slot(public)
const bookSlot = async(data) =>{
    const response = await axiosInstance.post('/api/bookings',data)
    return response.data
}

// to get all booking of logged in interviewer
const getInterviewerBookings = async() =>{
    const response = await axiosInstance.get('/api/bookings/interviewer')
    return response.data
}

// to cancel a booking
const cancelBooking = async(bookingId) =>{
    const response = await axiosInstance.put(`/api/bookings/cancel/${bookingId}`)
    return response.data
}

export {bookSlot,getInterviewerBookings,cancelBooking}