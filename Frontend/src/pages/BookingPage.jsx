// booking page - shows all interviewers list
// candidate clicks on interviewer to see their slots

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInterviewers } from "../services/auth.service";
import toast, {Toaster} from "react-hot-toast";
import { BsCalendarCheck } from 'react-icons/bs'
import { FiArrowRight } from 'react-icons/fi'

function Booking(){
    // to store interviewers list
    const [interviewers, setInterviewers] = useState([])
    // search state
    const [search, setSearch] = useState('')
    // loading state
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // fetching all interviewers on page load
    useEffect(() => {
        const fetchInterviewers = async() => {
            try {
                const res = await getInterviewers()
                setInterviewers(res.interviewers)
            } catch (err) {
                toast.error("Failed to load interviewers")
                console.error(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchInterviewers()
    },[])

    // function to filter interviewers by name
    const filteredInterviewers = interviewers.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    )

    return(
        <div className="min-h-screen bg-gray-950 p-6">
            <Toaster position="bottom-right" />

            <div className="max-w-2xl mx-auto">

                {/* header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BsCalendarCheck className="text-white text-xs" />
                    </div>
                    <span className="text-white font-medium text-sm">Interview Scheduler</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-white text-2xl font-medium">Book an Interview</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select an interviewer to see their available slots
                    </p>
                </div>

                {/* interviewers list */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

                    {/* search input */}
                    <div className="p-4 border-b border-gray-800">
                         <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search interviewer by name..."
                                 className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500"
                          />
                    </div>

                    {/* loading state */}
                    {loading ? (
                        <div className="text-gray-600 text-sm text-center py-12">
                            Loading interviewers...
                        </div>
                    ) : interviewers.length === 0 ? (
                        // empty state
                        <div className="text-gray-600 text-sm text-center py-12">
                            No interviewers available
                        </div>
                    ) : (
                        // interviewers list
                        filteredInterviewers.map((interviewer) => (
                            <div
                                key={interviewer._id}
                                onClick={() => navigate(`/book/${interviewer._id}`)}
                                className="flex items-center gap-4 p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                {/* avatar with initials */}
                                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-sm font-medium shrink-0">
                                    {interviewer.name?.charAt(0).toUpperCase()}
                                </div>

                                {/* interviewer info */}
                                <div className="flex-1">
                                    <div className="text-white text-sm font-medium">
                                        {interviewer.name}
                                    </div>
                                    <div className="text-gray-500 text-xs mt-0.5">
                                        {interviewer.email}
                                    </div>
                                </div>

                                {/* arrow icon */}
                                <FiArrowRight className="text-gray-600 text-sm" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
export default Booking