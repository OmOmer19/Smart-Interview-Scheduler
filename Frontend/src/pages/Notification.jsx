// notification page
import { useState,useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SideBar from "../components/SideBar";
import {getNotifications,markAsRead,markAllAsRead} from '../services/notification.service'
import toast, {Toaster} from "react-hot-toast";
import { IoNotificationsOutline } from 'react-icons/io5'
import { BsCalendarCheck, BsCalendarX } from 'react-icons/bs'
import { MdOutlineAccessTime } from 'react-icons/md'
import { TbCalendarRepeat } from 'react-icons/tb'

function Notification(){
    // to store notifications
    const [notifications, setNotifications] = useState([])
    //to store unread count
    const [unreadCount, setUnreadCount] = useState(0)
    // loading state
    const [loading, setLoading] = useState(true)

    // fetching notifications on page lead
    useEffect(() => {
        fetchNotifications()
    },[])

    // function to fetch notifications
    const fetchNotifications = async() => {
        try{
            const res = await getNotifications()
            setNotifications(res.notifications)
            setUnreadCount(res.unreadCount)
        }
        catch(err){
            console.error("Failed to fetch notifications:", err.message)
        }
        finally{
            setLoading(false)
        }
    }
    // function to mark single notification as read
    const handleMarkAsRead = async(notificationId) => {
        try{
            await markAsRead(notificationId)
            // updating local state without refetching
            setNotifications(prev => 
                prev.map(n => n._id === notificationId ? {...n, isRead: true} : n
                )
            )
            // decreasing unread count
            setUnreadCount(prev => Math.max(0, prev -1))
        }
        catch(err){
            toast.error("Failed to mark as read")
        }
    }
    // function to mark all notifications as read
    const handleMarkAllAsRead = async() => {
        try{
            await markAllAsRead()
            // marking all as read in local state
            setNotifications(prev => prev.map(n=> ({...n, isRead: true})))
            setUnreadCount(0)
            toast.success("All notifications marked as read")
        }
        catch(err){
            toast.error("Failed to mark all as read")
        }
    }
    // function to get icon based on notification type
    const getNotificationIcon = (type) =>{
        switch(type){
            case 'new_booking':
                // blue icon for new booking
                return <BsCalendarCheck className="text-blue-400 text-sm" />
            case 'cancellation':
                // red icon for cancellation
                return <BsCalendarX className="text-red-400 text-sm" />
            case 'reschedule':
                // purple icon for reschedule
                return <TbCalendarRepeat className="text-purple-400 text-sm" />
            case 'reminder':
                // amber icon for reminder
                return <MdOutlineAccessTime className="text-amber-400 text-sm" />
            default:
                return <IoNotificationsOutline className="text-gray-400 text-sm" />
        }
    }
    // function to get dot color based on notification type
    const getDotColor = (type) => {
        switch (type) {
            case 'new_booking': return 'bg-blue-500'
            case 'cancellation': return 'bg-red-500'
            case 'reschedule': return 'bg-purple-500'
            case 'reminder': return 'bg-amber-500'
            default: return 'bg-gray-500'
        }
    }
    // function to format time ago
    const formatTimeAgo = (dateStr) => {
        const now = new Date()
        const date = new Date(dateStr)
        // difference in minutes
        const diffMinutes = Math.floor((now - date) / 60000)

        if (diffMinutes < 1) return 'Just now'
        if (diffMinutes < 60) return `${diffMinutes} minutes ago`
        // difference in hours
        const diffHours = Math.floor(diffMinutes / 60)
        if (diffHours < 24) return `${diffHours} hours ago`
        // difference in days
        const diffDays = Math.floor(diffHours / 24)
        if (diffDays === 1) return 'Yesterday'
        return `${diffDays} days ago`
    }

    return(
        <div className="flex min-h-screen bg-gray-950">
            {/* toaster notifications */}
            <Toaster position="bottom-right" />
            {/* sidebar with unread count */}
            <SideBar unreadCount={unreadCount} />
            {/* main content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/* header */}
                <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-white text-2xl font-medium">
                        Notifications
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notifications`
                                         : 'All caught up' }
                    </p>
                </div>
                {/* mark all as read button - if unread exist */}
                {unreadCount > 0 && (
                    <button onClick={handleMarkAllAsRead}
                            className="text-blue-500 hover:text-blue-400 text-sm 
                                       font-medium transition-colors cursor-pointer"
                      >
                        Mark all as read
                    </button>
                )}
            </div>
            {/* notifications list */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {/* loading state */}
                {loading ? (
                    <div className="text-gray-600 text-sm text-center py-12">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    // empty state
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <IoNotificationsOutline className="text-gray-700 text-4xl" />
                        <div className="text-gray-600 text-sm">No notifications yet</div>
                    </div>
                ) : (
                    // notifications list
                    notifications.map((notification) => (
                        <div key={notification._id}
                             className={`flex items-start gap-4 p-4 border-b border-gray-800 last:border-0 transition-colors ${
                                    // unread notifications have slightly lighter background
                                    !notification.isRead ? 'bg-gray-800/50' : ''
                                }`}
                        >
                            {/* notification type icon */}
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                            </div>
                            {/* notification content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {/* unread count */}
                                    {!notification.isRead && (
                                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor(notification.type)}`} />
                                    )}
                                    {/* notification message */}
                                    <p className={`text-sm ${!notification.isRead ? 'text-white' : 'text-gray-400'}`}>
                                        {notification.message}
                                    </p>
                                </div>
                                {/* time ago */}
                                <p className="text-gray-600 text-xs">
                                    {formatTimeAgo(notification.createdAt)}
                                </p>
                            </div>
                            {/* mark as read button - only showing if unread */}
                            {!notification.isRead && (
                                <button onClick={() => handleMarkAsRead(notification._id)}
                                        className="text-gray-600 hover:text-blue-400 text-xs transition-colors cursor-pointer shrink-0"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    ))
                )}
                </div>
            </div>
        </div>
    )
}
export default Notification