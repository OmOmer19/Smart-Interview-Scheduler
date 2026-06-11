// protected route - wraps pages that require authentication
// redirects to login if no token found in auth context

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({children}) => {
    // getting auth state context
    const {token, loading} = useContext(AuthContext)

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Loading...</div>
            </div>
        )
    }
    // if no token 
    if (!token) {
        return <Navigate to="/" replace />
    }
    // if token exists - rendering the protected page
    return children
}

export default ProtectedRoute