// auth service - all auth related api calls
import axiosInstance from "../utils/axiosInstance";

// getting current logged in user(interviewer)  profile
const getProfile = async() =>{
    const response = await axiosInstance.get('/api/auth/profile')
    return response.data
}

// getting all interviewers list (public)
const getInterviewers = async() =>{
    const response = await axiosInstance.get('/api/auth/interviewers')
    return response.data
}

export  {getProfile, getInterviewers}