// slot booking page - shows available slots for a specific interviewer
// interviewer id is read from url params automatically
import { useState,useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import getAvailableSlots from "../services/slot.service";
import { bookSlot } from "../services/booking.service";
import toast, { Toaster } from 'react-hot-toast'
import { BsCalendarCheck } from 'react-icons/bs'
import { MdOutlineAccessTime } from 'react-icons/md'
import { FiUser, FiMail, FiArrowLeft } from 'react-icons/fi'

function SlotBooking(){
    // getting interviewer id from url params automatically
    const {interviewerId } = useParams()
    const navigate = useNavigate()
    // to store fetched slots
    const [slots, setSlots] = useState([])
    // to store selected slot
    const [selectedSlot, setSelectedSlot] = useState(null)
    // to store candidate form data
    const [formData, setFormData] = useState({
        candidateName: '',
        candidateEmail: '',
        note: ''
    })
    // loading states
    const [slotsLoading, setSlotsLoading] = useState(true)
    const [booking, setBooking] = useState(false)
    // booking success state
    const [bookingSuccess, setBookingSuccess] = useState(false)
    // to store booking result
    const [bookingResult, setBookingResult] = useState(null)

    // fetching slots on page load using interviewer id from url
    useEffect(() => {
        const fetchSlots = async() =>{
            try{
                const res = await getAvailableSlots(interviewerId)
                setSlots(res.slots)
                if (res.slots.length === 0) {
                    toast.error("No available slots for this interviewer")
                }
            }
            catch(err){
                toast.error("Failed to load slots")
                console.error(err.message)
            }
            finally{
                setSlotsLoading(false)
            }
        }
        fetchSlots()
    }, [interviewerId])

    // function to handle booking submission
    const handleBooking = async() => {
        if(!selectedSlot){
            toast.error("Please select a slot")
            return
        }
        if (!formData.candidateName.trim()) {
            toast.error("Please enter your name")
            return
        }
        if (!formData.candidateEmail.trim()) {
            toast.error("Please enter your email")
            return
        }
        try{
            setBooking(true)
            const res = await bookSlot({
                slotId: selectedSlot._id,
                candidateName: formData.candidateName,
                candidateEmail: formData.candidateEmail,
                note: formData.note
            })
            setBookingResult(res.booking)
            setBookingSuccess(true)
            toast.success("Slot booked successfully!")
        }
        catch(err){
            toast.error("Booking failed. Slot may already be taken.")
            console.error(err.message)
        }
        finally{
            setBooking(false)
        }
    }
    // function to formattt date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toDateString()
    }
    // functionn to formaat time
    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        })
    }
    // showing success screen after booking
    if(bookingSuccess){
        return(
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <Toaster position="bottom-right" />
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center">

                    {/* success icon */}
                    <div className="w-14 h-14 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-5">
                        <BsCalendarCheck className="text-green-400 text-2xl" />
                    </div>

                    <h2 className="text-white text-xl font-medium mb-2">
                        Interview Booked!
                    </h2>
                    <p className="text-gray-400 text-sm mb-6">
                        A confirmation email has been sent to your inbox with all the details.
                    </p>

                    {/* booking details */}
                    <div className="bg-gray-800 rounded-xl p-4 text-left mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-500 text-xs">Candidate</span>
                            <span className="text-white text-xs">
                                {bookingResult?.candidateName}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700">
                            <span className="text-gray-500 text-xs">Email</span>
                            <span className="text-white text-xs">
                                {bookingResult?.candidateEmail}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500 text-xs">Status</span>
                            <span className="text-green-400 text-xs">
                                {bookingResult?.status}
                            </span>
                        </div>
                    </div>

                    {/* back to interviewers button */}
                    <button
                        onClick={() => navigate('/book')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Back to interviewers
                    </button>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-gray-950 p-6">
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
                {/** back button */}
                <button
                    onClick={() => navigate('/book')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-sm 
                               mb-6 transition-colors cursor-pointer"
                >
                    <FiArrowLeft className="text-sm" />
                    Back to interviewers
                </button>
                <div className="mb-8">
                    <h1 className="text-white text-2xl font-medium">
                        Select a slot
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Pick an available time that works for you
                    </p>
                </div>
                {/* slots grid */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                    <h2 className="text-white text-sm font-medium mb-4">
                        Available slots — {slots.length} found
                    </h2>
                    {/**loading state */}
                    {slotsLoading ? (
                        <div className="text-gray-600 text-sm text-center py-6">
                            Loading slots...
                        </div>
                    ) : slots.length === 0 ?(
                        // empty state
                        <div className="text-gray-600 text-sm text-center py-6">
                            No available slots for this interviewer
                        </div>
                    ) : (
                        // slots grid
                        <div className="grid grid-cols-3 gap-3">
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
                {/* at the end booking form - only visible when slot is selected */}
                {selectedSlot && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        {/* selected slot info */}
                        <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3 mb-5">
                          <div className="text-blue-400 text-xs font-medium mb-1">
                            Selected slot
                          </div>
                          <div className="text-white text-sm">
                                {formatDate(selectedSlot.startTime)} · {formatTime(selectedSlot.startTime)} — {formatTime(selectedSlot.endTime)}
                          </div>
                        </div>
                        <h2 className="text-white text-sm font-medium mb-4">
                            Your details
                        </h2>
                        {/* name input */}
                        <div className="mb-4">
                            <label className="text-gray-400 text-xs mb-2 block">Full name</label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                <input type="text"
                                    value={formData.candidateName}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev, candidateName: e.target.value
                                    }))}
                                    placeholder="Your full name"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 
                                    pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {/* email input */}
                        <div className="mb-4">
                            <label className="text-gray-400 text-xs mb-2 block">Email address</label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                <input type="email"
                                    value={formData.candidateEmail}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev, candidateEmail: e.target.value
                                    }))}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 
                                    pr-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {/* note input */}
                        <div className="mb-5">
                            <label className="text-gray-400 text-xs mb-2 block">
                                Note for interviewer (optional)
                            </label>
                            <textarea
                                value={formData.note}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev, note: e.target.value
                                }))}
                                placeholder="Any message for the interviewer..."
                                rows={3}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm 
                                placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                            />
                        </div>
                        {/* submit button */}
                        <button
                            onClick={handleBooking}
                            disabled={booking}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed 
                            text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer"
                        >
                            {booking ? 'Booking...' : 'Confirm booking'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default SlotBooking