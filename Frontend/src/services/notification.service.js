// notification service - all notification related api calls
import axiosInstance from "../utils/axiosInstance";

// to get all notification for logged in interviewer
const getNotifications = async () => {
    const response = await axiosInstance.get('/api/notifications')
    return response.data
}

// to mark a single notification as read
const markAsRead = async (notificationId) =>{
    const response = await axiosInstance.patch(`/api/notifications/${notificationId}/read`)
    return response.data
}

// to mark all notifications as read
const markAllAsRead = async () =>{
    const response = await axiosInstance.patch('/api/notifications/read-all')
    return response.data
}

export {getNotifications,markAsRead,markAllAsRead}