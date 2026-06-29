// cancel page - candidate can cancel their booking using bookingId from email link
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from "../utils/axiosInstance";
import { BsCalendarX } from 'react-icons/bs'
import toast, {Toaster} from 'react-hot-toast'

function CancelPage(){
    // getting booking id from url
    const {bookingId} = useParams()
    const navigate = useNavigate()
    // storing booking details
    const [booking, setBooking] = useState(null)
    const [loading, setLoading] = useState(true)
    // cancelling  state
    const [cancelling, setCancelling] = useState(false)
   //cancel success state
   const [cancelled, setCancelled] = useState(false)

   // fetching booking details on load
   useEffect(() =>{
    const fetchBooking = async() =>{
        try{
            // fetching booking details by id
            const res = await axiosInstance.get(`/api/bookings/${bookingId}`)
            setBooking(res.data.booking)
        }
        catch(err){
            toast.error("Booking not found")
            console.error(err.message)
        }
        finally{
            setLoading(false)
        }
    }
    fetchBooking()
   },[bookingId])

   // function to handle cancel
   const handleCancel = async() =>{
    try{
        setCancelling(true)
        // calling cancel end point
        await axiosInstance.put(`/api/bookings/cancel/${bookingId}`)
        setCancelled(true)
        toast.success("Booking cancelled successfully")
    }
    catch(err){
        toast.error("Failed to cancel booking")
        console.error(err.message)
    }
    finally{
        setCancelling(false)
    }
   }

   // helper to format date
   const formatDate = (dateStr) => new Date(dateStr).toDateString()

   // to format time
   const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([],{
    hour: '2-digit',
    minute: '2-digit'
   })

   //  loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                    Loading booking details...
                </div>
            </div>
        )
    }

    // if booking not found 
    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                    Booking not found.
                </div>
            </div>
        )
    }

   //showing success screen after cancellation
   if(cancelled){
    return(
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Toaster position="top-center" />
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center">
                {/* cancel icon */}
                <div className="w-14 h-14 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-5">
                    <BsCalendarX className="text-red-400 text-2xl" />
                </div>
                <h2 className="text-white text-xl font-medium mb-2">
                    Booking Cancelled
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    Your interview has been cancelled and the slot has been released.
                    A confirmation email has been sent to you.
                </p>
                {/* back to booking button */}
                <button onClick={() => navigate('/book')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium 
                                   py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                    Book another interview
                </button>
            </div>
        </div>
    )
   }

   // if already cancelled
   if(booking.status === 'cancelled'){
    return(
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-gray-400 text-sm">
                This booking is already cancelled.
            </div>
        </div>
    )
   }
   
   // main cancel confirmation screen

   return(
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Toaster position="bottom-right" />
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full">
            {/* header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-red-900 rounded-full flex items-center 
                justify-center mx-auto mb-5">
                    <BsCalendarX className="text-red-400 text-2xl" />
                </div>
                <h2 className="text-white text-xl font-medium mb-2">
                    Cancel Interview
                </h2>
                <p className="text-gray-400 text-sm">
                    Are you sure you want to cancel this interview?
                </p>
            </div>
            {/* booking details */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-500 text-xs">Candidate</span>
                    <span className="text-white text-xs">{booking.candidateName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-500 text-xs">Date</span>
                    <span className="text-white text-xs">
                        {booking.slot ? formatDate(booking.slot.startTime) : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between py-2">
                    <span className="text-gray-500 text-xs">Time</span>
                    <span className="text-white text-xs">
                        {booking.slot ? 
                        `${formatTime(booking.slot.startTime)} — ${formatTime(booking.slot.endTime)}` 
                        : 'N/A'}
                    </span>
                </div>
            </div>
            {/* confirm cancel button */}
            <button onClick={handleCancel}
                    disabled={cancelling}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-800 
                              disabled:cursor-not-allowed text-white text-sm font-medium py-3 
                              rounded-lg transition-colors cursor-pointer"
            >
                {cancelling ? 'Cancelling...' : 'Confirm cancellation'}
            </button>
        </div>
    </div>
   )
}

export default CancelPage