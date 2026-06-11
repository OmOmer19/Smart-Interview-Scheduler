import { FcGoogle } from 'react-icons/fc'
import { BsCalendarCheck } from 'react-icons/bs'

function Login(){
    // function to handle google login
    const handleGoogleLogin = () =>{
        // sending user to backend which handles google oauth flow
        window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`
    }

    return (
        <div className='min-h-screen bg-gray-950 flex items-center justify-center p-4'>
            {/* main card - splitting into two left and right */}
            <div className='w-full max-w-5xl bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex min-h-[600px]'>
                {/*LEFT SIDE - login panel*/}
                <div className="flex-1 p-12 flex flex-col justify-between border-r border-gray-800">
                    {/*logo */}
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                            <BsCalendarCheck className='text-white text-sm' />
                        </div>
                        <span className='text-white font-medium text-sm'>
                            Interview Scheduler
                        </span>
                    </div>
                    {/* center content */}
                    <div className='flex flex-col gap-6'>
                        {/* label */}
                        <span className='text-blue-500 text-xs font-semibold tracking-widest uppercase'>
                            For engineering teams
                        </span>
                        {/* headline */}
                        <h1 className='text-white text-3xl font-medium leading-snug'>
                            Schedule interviews. <br />
                            <span className='text-blue-500'>Stop chasing</span> people.
                        </h1>
                        {/* sub heading */}
                        <p className='text-gray-400 text-sm leading-relaxed max-w-sm'>
                            Connect your Google account, set your availability once,
                            and let candidates book directly. Calendar invites and
                            confirmation emails go out automatically.
                        </p>
                        {/* google login button */}
                        <button  onClick={handleGoogleLogin}
                               className='flex items-center justify-center gap-3 w-full max-w-xs 
                        py-3 px-5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl 
                        text-white text-sm font-medium transition-colors duration-200 cursor-pointer'>
                            <FcGoogle className='text-lg' />
                            Continue with Google
                        </button>
                        {/* divider */}
                        <div className='flex items-center gap-3 max-w-xs'>
                            <div className='flex-1 h-px bg-gray-800'/>
                            <span className='text-gray-600 text-xs'>or</span>
                            <div className='flex-1 h-px bg-gray-800' />
                        </div>
                        {/* candidate link */}
                        <p className='text-gray-500 text-sm'>
                            Looking to book an interview?{' '}
                            <a href="/book" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                               Find a slot →
                            </a>
                        </p>
                    </div>
                    {/* footer note */}
                    <p className='text-gray-600 text-xs'>
                        By signing in you agree to our term of service.
                    </p>
                </div>
                {/* RIGHT SIDE - static dashboard preview (mock data) */}
                <div className='flex-1 p-8 bg-gray-950 flex flex-col gap-4 overflow-y-auto'>
                    {/* section label */}
                    <span className='text-gray-600 text-xs font-semibold tracking-widest uppercase'>
                        Live dashboard preview
                    </span>
                    {/* stats row - 4 cards */}
                    <div className='grid grid-cols-2 gap-3'>
                        {/* stat card - slots */}
                        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                            <div className='text-white text-2xl font-medium'>24</div>
                            <div className='text-gray-500 text-xs mt-1'>Slots this month</div>
                            <div className='text-blue-500 text-xs mt-2 flex items-center gap-1'>
                                ↑ +8 from last month
                            </div>
                        </div>
                        {/* stat card-  booked */}
                        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                            <div className='text-white text-2xl font-medium'>18</div>
                            <div className='text-gray-500 text-xs mt-1'>Booked</div>
                            <div className='text-blue-500 text-xs mt-2'>75% fill rate</div>
                        </div>
                        {/* stat card - completed */}
                        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                            <div className='text-white text-2xl font-medium'>11</div>
                            <div className='text-gray-500 text-xs mt-1'>Completed</div>
                            <div className='text-green-500 text-xs mt-2'>✓ All time</div>
                        </div>
                        {/* stat card - cancelled */}
                        <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                            <div className='text-white text-2xl font-medium'>2</div>
                            <div className='text-gray-500 text-xs mt-1'>Cancelled</div>
                            <div className='text-gray-600 text-xs mt-2'>This month</div>
                        </div>
                    </div>
                    {/* upcoming bookings preview card -mock data */}
                    <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                        {/* card header */}
                        <div className='flex items-center justify-between mb-3'>
                            <span className='text-white text-sm font-medium'>Upcoming this week</span>
                            <span className='text-xs bg-green-900 text-green-400 px-2 py-1 rounded-md'>
                                3 confirmed
                            </span>
                        </div>
                        {/* bookig row 1 -mock */}
                        <div className='flex items-center gap-3 py-2 border-t border-gray-800'>
                            <div className='w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-xs font-medium'>
                                AR
                            </div>
                            <div className='flex-1'>
                                <div className='text-white text-xs font-medium'>Arvind Rawat</div>
                                <div className='text-gray-500 text-xs mt-0.5'>Today · 11:00 AM — 11:30 AM</div>
                            </div>
                            <span className='text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded-md'>
                                Confirmed
                            </span>
                        </div>
                        {/* booking row 2 - mock */}
                        <div className='flex items-center gap-3 py-2 border-t border-gray-800'>
                            <div className='w-7 h-7 rounded-full bg-green-900 flex items-center justify-center text-green-400 text-xs font-medium'>
                                SP
                            </div>
                            <div className='flex-1'>
                                <div className='text-white text-xs font-medium'>Sneha Patel</div>
                                <div className='text-gray-500 text-xs mt-0.5'>Tomorrow · 2:00 PM — 2:45 PM</div>
                            </div>
                            <span className='text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded-md'>
                                Confirmed
                            </span>
                        </div>
                        {/* booking row 3 -mock */}
                        <div className='flex items-center gap-3 py-2 border-t border-gray-800'>
                            <div className='w-7 h-7 rounded-full bg-amber-900 flex items-center justify-center text-amber-400 text-xs font-medium'>
                                MK
                            </div>
                            <div className='flex-1'>
                                <div className='text-white text-xs font-medium'>Mihir Kumar</div>
                                <div className='text-gray-500 text-xs mt-0.5'>Thu · 10:00 AM — 10:30 AM</div>
                            </div>
                            <span className='text-xs bg-blue-900 text-blue-400 px-2 py-1 rounded-md'>
                                Confirmed
                            </span>
                        </div>
                    </div>
                    {/* notification preview card- mock data */}
                    <div className='bg-gray-900 border border-gray-800 rounded-xl p-4'>
                        {/*card header */}
                        <div className='flex items-center justify-between mb-3'>
                            <span className='text-white text-sm font-medium'>Recent notifications</span>
                            <span className='text-blue-500 text-xs cursor-pointer'>Mark all read</span>
                        </div>
                        {/* notification 1 -mock - new booking */}
                        <div className='flex items-start gap-3 py-2 border-t border-gray-800'>
                            <div className='w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0' />
                            <div>
                                <div className='text-gray-300 text-xs leading-relaxed'>
                                    <span className='text-white font-medium'>New booking</span>
                                    — Arvind Rawat booked a slot for today
                                </div>
                                <div className='text-gray-600 text-xs mt-1'>2 minutes ago</div>
                            </div>
                        </div>
                        {/* notification 2 - reminder  demo mock*/}
                        <div className='flex items-start gap-3 py-2 border-t border-gray-800'>
                            <div className='w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0' />
                            <div>
                                <div className='text-gray-300 text-xs leading-relaxed'>
                                    <span className='text-white font-medium'>Reminder</span>
                                    — Interview with Aradhya Singh in 30 minutes
                                </div>
                                <div className='text-gray-600 text-xs mt-1'>1 hour ago</div>
                            </div>
                        </div>
                        {/* notification 3 - completed mock data */}
                        <div className='flex items-start gap-3 py-2 border-t border-gray-800'>
                            <div className='w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0' />
                                <div>
                                <div className='text-gray-300 text-xs leading-relaxed'>
                                    <span className='text-white font-medium'>Completed</span>
                                     — Interview with Rohan Sharma marked done
                                </div>
                                <div className='text-gray-600 text-xs mt-1'>Yesterday</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login