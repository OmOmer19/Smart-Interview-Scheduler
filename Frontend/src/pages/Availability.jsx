// interviewer to create availability rule

import { useState,useEffect } from "react";
import createAvailability from "../services/availability.service";
import getAvailableSlots from "../services/slot.service"
import SideBar from '../components/SideBar'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast, {Toaster} from 'react-hot-toast'

function Availability(){
    // getting user from auth context
    const {user} = useContext(AuthContext)
    // form state for availablitity rule
    const [formData, setFormData] = useState({
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        duration: 30
    })
    // storing fetched slots
    const [slots, setSlots] = useState([])
    // slots loading state
    const [slotsLoading, setSlotsLoading] = useState(true)
    // loading state for form submission
    const [submitting, setSubmitting] = useState(false)
    // days of week config for checkbox grid
    const days = [
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 },
        { label: 'Sun', value: 0 }
    ]
    // fetching slots
    useEffect(() => {
        
        const fetchSlots = async() => {
            try{
                // using logged in user id to fetch their slots
                const res = await getAvailableSlots(user.id)
                setSlots(res.slots)
            }
            catch(err){
                console.error("Failed to fetch slots:", err.message)
            }
            finally{
                setSlotsLoading(false)
            }
        }
        fetchSlots()
    },[user])

    // function to handle checkbox toggle
    const handleDayToggle = (value) => {
        setFormData(prev => ({
            ...prev,
            // if day already selected - removing it , else adding it
            daysOfWeek: prev.daysOfWeek.includes(value) ? prev.daysOfWeek.filter(d => d!== value)
                                                        : [...prev.daysOfWeek, value]
        }))
    }
    // function to handle form submission
    const handleSubmit = async() => {
        // validating
        if(formData.daysOfWeek.length === 0){
            toast.error("Please select at least one day")
            return
        }
        if(!formData.startTime || !formData.endTime){
            toast.error("Please provide start and end time")
            return
        }
        try{
            setSubmitting(true)
            // calling availability service
            await createAvailability(formData)
            toast.success("Availability created and slots generated!")
            // refreshing slots after creation
            const res = await getAvailableSlots(user.id)
            setSlots(res.slots)
            // resetting form
            setFormData({daysOfWeek:[], startTime:'', endTime:'', duration: 30})
        }
        catch(err) {
            toast.error("Failed to create availability")
            console.error(err.message)
        }
        finally{
            setSubmitting(false)
        }
    }
    // function to format date
    const formatDate = (dateStr) => {
        return new Date(dateStr).toDateString()
    }
    // function to format time
    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString([],{
            hour:'2-digit',
            minute: '2-digit'
        })
    }

    return(
        <div className="flex min-h-screen bg-gray-950">
            {/* toast notifications */}
            <Toaster position="bottom-right" />
            {/* sidebar */}
            <SideBar unreadCount={0} />
            {/* main content */}
            <div className="flex-1 p-8 overflow-y-auto">
                {/* header */}
                <div className="mb-8">
                    <h1 className="text-white text-2xl font-medium">
                        Availability
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Set your weekly availability and auto-generate bookable slots
                    </p>
                </div>
                {/* create availability form */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
                    {/* form header */}
                    <h2 className="text-white text-sm font-medium mb-5">
                        Create availability rule
                    </h2>
                    {/** days of week selector */}
                    <div className="mb-5">
                        <label className="text-gray-400 text-xs mb-3 block">
                            Days of week
                        </label>
                        <div className="flex gap-2">
                            {days.map((day) => (
                                <button key={day.value}
                                        onClick={() => handleDayToggle(day.value)}
                                    className={`w-10 h-10 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                              formData.daysOfWeek.includes(day.value)
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                              }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* time inputs row */}
                    <div className="flex gap-4 mb-5">
                        {/* start time */}
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs mb-2 block">
                               Start Time
                            </label>
                            <input type="time" 
                                   value={formData.startTime}
                                   onChange={(e) => setFormData(prev => ({
                                                    ...prev, startTime: e.target.value
                                            }))}
                                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                                              text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* end time */}
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs mb-2 block">
                               End Time
                            </label>
                            <input type="time" 
                                   value={formData.endTime}
                                   onChange={(e) => setFormData(prev => ({
                                                    ...prev, endTime: e.target.value
                                            }))}
                                   className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5
                                              text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {/* duration */}
                        <div className="flex-1">
                            <label className="text-gray-400 text-xs mb-2 block">
                                Duration (minutes)
                            </label>
                            <select value={formData.duration}
                                    onChange={(e) => setFormData(prev => ({
                                                     ...prev, duration: Number(e.target.value)
                                             }))}   
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 
                                               text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"  
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                            </select>
                        </div>
                    </div>
                    {/* submiit button */}
                    <button onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed 
                                       text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        {submitting ? 'Saving...': 'Save & generate slots'}
                    </button>
                </div>
                {/* slots list */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    {/* section header */}
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-white text-sm font-medium">
                            Your available slots
                        </h2>
                        <span className="text-gray-600 text-xs">
                            {slots.length} slots
                        </span>
                    </div>
                    {/* loading state */}
                    {slotsLoading ? (
                        <div className="text-gray-600 text-sm text-center py-6">
                            Loading slots...
                        </div>
                    ): slots.length === 0 ? (
                        // empty state
                        <div className="text-gray-600 text-sm text-center py-6">
                            No slots yet — create an availability rule above
                        </div>
                    ) : (
                        // slots grid
                        <div className="grid grid-cols-3 gap-3">
                            {slots.map((slot) => (
                                <div key={slot._id}
                                     className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                                >
                                    {/* slot date */}
                                    <div className="text-white text-xs font-medium mb-1">
                                        {formatDate(slot.startTime)}
                                    </div>
                                    {/*slot time */}
                                    <div className="text-gray-400 text-xs">
                                        {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                                    </div>
                                    {/** slot status badge */}
                                    <div className="mt-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-md ${
                                            slot.status === 'available'
                                                ? 'bg-green-900 text-green-400'
                                                : slot.status === 'booked'
                                                ? 'bg-blue-900 text-blue-400'
                                                : 'bg-gray-700 text-gray-400'
                                        }`}>
                                            {slot.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Availability