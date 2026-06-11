// auth service - all auth related api calls
import axiosInstance from "../utils/axiosInstance";

// getting ucrrect logged in user(interviewer)  profile
const getProfile = async() =>{
    const response = await axiosInstance.get('/api/auth/profile')
    return response.data
}

export default getProfile