// availability service - all availability related api calls
import axiosInstance from "../utils/axiosInstance"

// to create a new availability rule
const createAvailability = async (data) => {
    const response = await axiosInstance.post('/api/availability', data)
    return response.data
}
export default createAvailability