// auth callback page - handles redirect from backend after google oauth
// reads token and user info from url and saves to auth context

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AuthCallbackPage(){
    // getting login function from auth context
    const {login} = useContext(AuthContext)
    
    const navigate = useNavigate()

    useEffect(() =>{
        // reading query params from url
        const params = new URLSearchParams(window.location.search)

        // extracting token and user info
        const token = params.get('token')
        const id = params.get('id')
        const name = params.get('name')
        const email = params.get('email')

        if(token && id){
            // saving token and user info to authcontest + localstorage
            login(token, {id,name,email})
            // redirecting to dashboard
            navigate("/dashboard")
        }
        else{
            // if no token found
            navigate("/")
        }
    },[])
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Signing you in...</div>
        </div>
    )
}
export default AuthCallbackPage