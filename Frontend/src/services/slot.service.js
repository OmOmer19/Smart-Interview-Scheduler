// slot service - all slot related api calls

import axiosInstance from "../utils/axiosInstance";

// getting available slots of an interviewer (public)
const getAvailableSlots = async(interviewerId) =>{
    const response = await axiosInstance.get(`/api/slots/${interviewerId}`)
    return response.data
}

export default getAvailableSlots