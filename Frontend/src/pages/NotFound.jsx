import { BsCalendarCheck } from 'react-icons/bs'

function NotFound(){

    return(
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="text-center">
                {/* logo */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BsCalendarCheck className="text-white text-xs" />
                    </div>
                    <span className="text-white font-medium text-sm">
                        Interview Scheduler
                    </span>
                </div>
                {/* 404  message*/}
                <h1 className="text-8xl font-medium text-gray-800 mb-4">404</h1>
                <h2 className="text-white text-xl font-medium mb-2">
                    Page not found
                </h2>
                <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                {/* action buttons */}

            </div>
        </div>
    )
}
export default NotFound