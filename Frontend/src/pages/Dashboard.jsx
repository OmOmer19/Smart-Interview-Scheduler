// interviewer Dashboard

import { useState , useEffect } from "react";
import {getStats, getUpcomingBookings, getPastBookings} from "../services/dashboard.service"
import SideBar from "../components/SideBar";
import { BsCalendarCheck, BsCalendarX } from 'react-icons/bs'
import { MdOutlinePendingActions } from 'react-icons/md'
import { FiCheckCircle } from 'react-icons/fi'

function Dashboard(){
    // to store stats from api
    const [stats, setStats] = useState(null)
    // to store upcoming bookings
    const [upcomingBookings, setUpcomingBookings] = useState([])
    const [pastBookings, setPastBookings] = useState([])
    const [loading , setLoading] = useState(true)

    // fetching all dashboard data
    useEffect(() =>{
        const fetchDashboardData = async() =>{
            try{
                // fetching stats, upcoming and passbookings simultaneously
                const [statsData, upcomingData, pastData] = await Promise.all([
                    getStats(),
                    getUpcomingBookings(),
                    getPastBookings()
                ])
                //saving to state
                setStats(statsData)
                setUpcomingBookings(upcomingData.bookings)
                setPastBookings(pastData.bookings)
            }
            catch(err){
                console.error("Dashboard fetch failed:",err.message)
            }
            finally{
                setLoading(false)
            }
        }
        fetchDashboardData()
    },[])

    // funcion to format date nicely
    const formatDate = (datestr) =>{
        return new Date(datestr).toDateString()
    }
    // function to format time nicely
    const formatTime = (datestr) =>{
        return new Date(datestr).toLocaleTimeString([],{
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    if(loading){
        return(
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                    Loading Dashboard...
                </div>
            </div>
        )
    }

    return(
        <div className="flex min-h-screen bg-gray-950">
            {/*sidebar */}
            <SideBar unreadCount={0} />
            {/* main content area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/*page header */}
                <div className="mb-8">
                    <h1 className="text-white text-2xl font-medium">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Your interview activity at a glance
                    </p>
                </div>
                {/* stats  card row */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {/* total slots card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-xs">
                                Total Slots
                            </span>
                            <BsCalendarCheck className="text-blue-500 text-lg" />
                        </div>
                        <div className="text-white text-2xl font-medium">
                            {/* adding all slot counts */}
                            {stats ? 
                                (stats.allTime.available+
                                stats.allTime.booked +
                                stats.allTime.completed+
                                stats.allTime.cancelled)
                            : 0}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                            All Time
                        </div>
                    </div>
                    {/* booked card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-xs">
                                Booked
                            </span>
                            <MdOutlinePendingActions className="text-amber-500 text-lg" />
                        </div>
                        <div className="text-white text-2xl font-medium">
                            { stats?.allTime.booked || 0}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                            {stats?.currentMonth.booked || 0} this month
                        </div>
                    </div>
                    {/*completed card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-xs">
                                Completed
                            </span>
                            <FiCheckCircle className="text-green-500 text-lg" />
                        </div>
                        <div className="text-white text-2xl font-medium">
                            {stats?.allTime.completed || 0}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                            {stats?.currentMonth.completed || 0} this month
                        </div>
                    </div>
                    {/* cancelled card */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-xs">
                                Cancelled
                            </span>
                            <BsCalendarX className="text-red-500 text-lg"/>
                        </div>
                        <div className="text-white text-2xl font-medium">
                            {stats?.allTime.cancelled || 0} 
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                            {stats?.currentMonth.cancelled || 0} this month
                        </div>
                    </div>
                </div>
                {/* upcoming booking section */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    {/* section header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-white text-sm font-medium">
                            Upcoming this week
                        </h2>
                        <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded-md">
                            {upcomingBookings.length} confirmed
                        </span>
                    </div>
                    {/* empty state */}
                    {upcomingBookings.length === 0? (
                        <div className="text-gray-600 text-sm text-center py-6">
                            No upcoming bookings this week
                        </div>
                    ): (
                        //bookings list
                        <div className="flex flex-col gap-1">
                            {upcomingBookings.map((booking) => (
                                <div key={booking._id}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    {/* candidate avtar with initials */}
                                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-xs font-medium shrink-0">
                                        {booking.candidateName?.charAt(0).toUpperCase()}
                                    </div>
                                    {/** candidate info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-medium">
                                            {booking.candidateName}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                            {booking.slot
                                                ? `${formatDate(booking.slot.startTime)} · ${formatTime(booking.slot.startTime)} — ${formatTime(booking.slot.endTime)}`
                                                : 'Slot details unavailable'}
                                        </div>
                                    </div>
                                    {/** candidate email */}
                                    <div className="text-gray-500 text-xs">
                                        {booking.candidateEmail}
                                    </div>
                                    {/* status badge */}
                                    <span className="text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded-md shrink-0">
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* past bookings */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    {/* section header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-white text-sm font-medium">
                            Past Bookings
                        </h2>
                        <span className="text-gray-600 text-xs">
                            {pastBookings.length} total
                        </span>
                    </div>
                    {/* empty state */}
                    {pastBookings.length === 0 ?(
                        <div className="text-gray-600 text-sm text-center py-6">
                            No past bookings yet
                        </div>
                    ): (
                        // past bookings list
                        <div className="flex flex-col gap-1">
                            {pastBookings.map((booking) => (
                                <div key={booking._id}
                                     className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    {/* candidate avtar */}
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-xs font-medium shrink-0">
                                        {booking.candidateName?.charAt(0).toUpperCase()}
                                    </div>
                                    {/* info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white text-sm font-medium">
                                            {booking.candidateName}
                                        </div>
                                        <div className="text-gray-500 text-xs mt-0.5">
                                            {booking.slot
                                                  ?`${formatDate(booking.slot.startTime)} · ${formatTime(booking.slot.startTime)} — ${formatTime(booking.slot.endTime)}`
                                                  : 'Slot details unavailable'}
                                        </div>
                                    </div>
                                    {/* candidate email */}
                                    <div className="text-gray-500 text-xs">
                                        {booking.candidateEmail}
                                    </div>
                                    {/* status badge */}
                                    <span className={`text-xs px-2 py-1 rounded-md shrink-0 ${
                                            booking.status === 'completed'
                                            ? 'bg-green-900 text-green-400'
                                            : booking.status === 'cancelled'
                                            ? 'bg-red-900 text-red-400'
                                            : 'bg-gray-800 text-gray-400'}`}
                                            >
                                             {booking.status}   
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Dashboard