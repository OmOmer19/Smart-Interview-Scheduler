// for interviewer dashboard

import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BsCalendarCheck } from "react-icons/bs";
import { MdDashboard, MdOutlineCalendarMonth } from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5'
import { BiLogOut } from 'react-icons/bi'
import { HiMenu, HiX } from 'react-icons/hi'
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";

const SideBar = ({unreadCount}) =>{
    // getting user and logout from auth context
    const {user, logout} = useContext(AuthContext)
    const navigate = useNavigate()

    // mobile menu open/close state
    const [mobileOpen, setMobileOpen] = useState(false)

    // to handle logout
    const handleLogout = () =>{
        // clearing authstate and localstorage
        logout()
        //redirecting to login
        navigate("/")
    }
    // navigation links config
    const navLinks = [
        {
            //dashboard link
            path: '/dashboard',
            label: 'Dashboard',
            icon: <MdDashboard className="text-lg" />
        },
        {
            //availablity link
            path: '/availability',
            label: 'Availability',
            icon: <MdOutlineCalendarMonth className="text-lg" />
        },
        {
            // notification link
            path: '/notification',
            label: 'Notification',
            icon: <IoNotificationsOutline className="text-lg" />
        }
    ]
    return(
        <>
        {/* desktop sidebar - hidden on mobile */}
        <div className="hidden md:flex w-60 min-h-screen bg-gray-900 border-r border-gray-800 flex-col">
            {/* logo */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-800">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BsCalendarCheck className="text-white text-xs" />
                </div>
                <span className="text-white font-medium text-sm">
                    Interview Scheduler
                </span>
            </div>
            {/* navigation links */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                    <NavLink key={link.path} to={link.path}
                             onClick={() => setMobileOpen(false)}
                             className={({isActive}) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                                {link.label === 'Notification' && unreadCount > 0 && (
                                    <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                    </NavLink>
                ))}
            </nav>
            {/* user info + logout at bottom */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-xs font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">
                            {user?.name}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                            {user?.email}
                        </div>
                    </div>
                </div>
                <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-150 cursor-pointer"
                 >
                    <BiLogOut className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        </div>

        {/* hamburger button - only visible on mobile */}
        <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-white cursor-pointer"
        >
            <HiMenu className="text-lg" />
        </button>

        {/* dark overlay - shown when mobile menu is open */}
        {mobileOpen && (
            <div
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed inset-0 bg-black/60 z-40"
            />
        )}

        {/* mobile sidebar drawer - slides in from left */}
        <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
            {/* close button */}
            <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
            >
                <HiX className="text-xl" />
            </button>
            {/* logo */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-800">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BsCalendarCheck className="text-white text-xs" />
                </div>
                <span className="text-white font-medium text-sm">
                    Interview Scheduler
                </span>
            </div>
            {/* navigation links */}
            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                    <NavLink key={link.path} to={link.path}
                             onClick={() => setMobileOpen(false)}
                             className={({isActive}) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                            >
                                {link.icon}
                                <span>{link.label}</span>
                                {link.label === 'Notification' && unreadCount > 0 && (
                                    <span className="ml-auto bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                    </NavLink>
                ))}
            </nav>
            {/* user info + logout at bottom */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-blue-400 text-xs font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-xs font-medium truncate">
                            {user?.name}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                            {user?.email}
                        </div>
                    </div>
                </div>
                <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-150 cursor-pointer"
                 >
                    <BiLogOut className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    </>
    )
}
export default SideBar