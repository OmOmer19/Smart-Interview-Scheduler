// axios instance - pre-configured axios with base url and jwt token
// every api call automatically gets the jwt token attached
//  we dont have to manually add token in every request

import axios from "axios"

// creating axios instance with base url from env
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// request interceptor - runs before every api call
// automatically attaches jwt token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        // getting token from localstorage
        const token = localStorage.getItem('token')

        //if token - attaching to authorization header
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// response interceptor - runs after every api response
// handles 401 unauthorized - token expired or invalid
axiosInstance.interceptors.response.use(
    (response) => {
        // if res is fine just returning it
        return response
    },
    (error)=> {
        //// if 401(authmiddleware response) - token expired - clearing storage and redirecting to login
        if(error.response?.status === 401){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/'
        }
        return Promise.reject(error)
    }
)

export default axiosInstance