// reschedule page - candidate can reschedule their booking using bookingId from email link
import { useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import getAvailableSlots from "../services/slot.service";
import { BsCalendarCheck } from 'react-icons/bs'
import { MdOutlineAccessTime } from 'react-icons/md'
import toast, { Toaster } from 'react-hot-toast'

function ReschedulePage(){
    // getting booking id from url
    const {bookingId} = useParams()
    const navigate = useNavigate()

    //to store current booking details
    const [booking, setBooking] = useState(null)
    // to store available slots of interviewer
    const [slots, setSlots] = useState([])
    // to store selected new slot
    const [selectedSlot, setSelectedSlot] = useState(null)
    // loading states
    const [loading, setLoading] = useState(true)
    const [rescheduling, setRescheduling] = useState(false)
    // reschedule success state
    const [rescheduled, setRescheduled] = useState(false)

    // fetching booking details and slots on load
    useEffect(() =>{
        const fetchBookingAndSlots = async () =>{
            try{
                // fetching current booking details
                const res = await axiosInstance.get(`/api/bookings/${bookingId}`)
                setBooking(res.data.booking)

                // fetching available slots for same interviewer
                const slotRes = await getAvailableSlots(res.data.booking.interviewer)
                setSlots(slotRes.slots)
            }
            catch(err){
                toast.error("Booking not found")
                console.error(err.message)
            }
            finally{
                setLoading(false)
            }
        }
        fetchBookingAndSlots()
    }, [bookingId])

    // function to handle reschedule
    const handleReschedule = async () =>{
        if(!selectedSlot){
            toast.error("Please select a new slot")
            return
        }
        try{
            setRescheduling(true)
            // calling reschedule end point with new slot id
            await axiosInstance.put(`/api/bookings/reschedule/${bookingId}`,{
                newSlotId: setSelectedSlot._id
            })
            setRescheduled(true)
            toast.success("Booking rescheduled successfully")
        }
        catch(err){
            toast.error("Failed to reschedule booking")
            console.error(err.message)
        }
        finally{
            setRescheduling(false)
        }
    }

    // helper to format date
    const formatDate = (dateStr) => new Date(dateStr).toDateString()

    // helper to format time
    const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString([],{
        hour: '2-digit',
        minute: '2-digit'
    })

    // loading state
    if(loading){
        return(
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
    // if already cancelled
    if (booking.status === 'cancelled') {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-400 text-sm">
                    This booking has been cancelled and cannot be rescheduled.
                </div>
            </div>
        )
    }
    // success screen after reschedule
    if (rescheduled) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Toaster position="top-center" />
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center">
                    {/* success icon */}
                    <div className="w-14 h-14 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-5">
                        <BsCalendarCheck className="text-green-400 text-2xl" />
                    </div>
                    <h2 className="text-white text-xl font-medium mb-2">
                        Interview Rescheduled!
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        Your interview has been rescheduled successfully.
                        A confirmation email has been sent to you with the new details.
                    </p>
                    {/* back to booking button */}
                    <button
                        onClick={() => navigate('/book')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        )
    }

    //  main reschedule screen
    return(
        <div className="min-h-screen bg-gray-950 p-4 md:p-6">
            <Toaster position="bottom-right" />
            <div className="max-w-4xl mx-auto">
                {/* header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BsCalendarCheck className="text-white text-xs" />
                    </div>
                    <span className="text-white font-medium text-sm">
                        Interview Scheduler
                    </span>
                </div>

                <div className="mb-8">
                    <h1 className="text-white text-2xl font-medium">
                        Reschedule Interview
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select a new slot to reschedule your interview
                    </p>
                </div>

                {/* current booking details */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-medium mb-4">
                        Current booking
                    </h2>
                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-500 text-xs">Candidate</span>
                            <span className="text-white text-xs">
                                {booking.candidateName}
                            </span>
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
                </div>
                {/* available slots */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-medium mb-4">
                        Select a new slot — {slots.length} available
                    </h2>
                    {/* no slots state */}
                    {slots.length === 0 ? (
                        <div className="text-gray-600 text-sm text-center py-6">
                            No available slots for this interviewer
                        </div>
                    ) : (
                        // slots grid
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {slots.map((slot) => (
                                <button key={slot._id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                                        selectedSlot?._id === slot._id
                                            ? 'bg-blue-600 border-blue-500'
                                            : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                                    }`}
                                >
                                    {/* slot date */}
                                    <div className="text-white text-xs font-medium mb-1">
                                        {formatDate(slot.startTime)}
                                    </div>
                                    {/* slot time */}
                                    <div className={`text-xs flex items-center gap-1 ${
                                        selectedSlot?._id === slot._id ? 'text-blue-200' : 'text-gray-400'
                                    }`}>
                                        <MdOutlineAccessTime className="text-xs" />
                                        {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* selected slot info & confirm button */}
                {selectedSlot && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        {/* selected slot info */}
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3 mb-5">
                           <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3 mb-5">
                              New selected slot
                           </div>
                           <div className="text-white text-sm">
                              {formatDate(selectedSlot.startTime)} · {formatTime(selectedSlot.startTime)} — {formatTime(selectedSlot.endTime)}
                            </div>
                        </div>
                        {/* confirm reschedule button */}
                        <button
                            onClick={handleReschedule}
                            disabled={rescheduling}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm 
                                       font-medium py-3 rounded-lg transition-colors cursor-pointer"
                        >
                            {rescheduling ? 'Rescheduling...' : 'Confirm reschedule'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default ReschedulePage