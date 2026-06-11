// manages global authentication state - store jwt and user info

import { createContext, useState, useEffect } from "react";

const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        // getting token from localstorage
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if(savedToken && savedUser){
            // restoring auth state from localstorage
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        // done checking
        setLoading(false)
    },[])

    // function to login - saves token and user to state and local storage
    const login = (token,user) =>{
        //saving to state
        setToken(token)
        setUser(user)
        // saving to local storage so user stays logged in on refresh
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    }
    // function to logout - clears everything
    const logout = () =>{
        //clearing state
        setToken(null)
        setUser(null)
        //clearing localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }
    return(
        // providing auth state and function to all child components
        <AuthContext.Provider value={{user, token, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export  {AuthContext, AuthProvider} 