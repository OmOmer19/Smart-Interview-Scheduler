import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import AuthCallbackPage from "./pages/AuthCallback"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Availability from "./pages/Availability"
import Notification from "./pages/Notification"
import Booking from "./pages/BookingPage"
import SlotBooking from "./pages/SlotBookingPage"
import NotFound from "./pages/NotFound"

function App() {

  return (
    <Routes>
      {/*login */}
      <Route path="/" element={<Login/>} />
      {/*oAuth callback - reads token from url after login */}
      <Route path="/auth/callback" element={<AuthCallbackPage/>}/>
      {/* booking page route - public*/}
      <Route path="/book" element={<Booking/>} />
      {/* slot booking page route - public*/}
      <Route path="/book/:interviewerId" element={<SlotBooking/>} />

      {/* protected route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path="/availability" element={
        <ProtectedRoute>
          <Availability/>
        </ProtectedRoute>
      }/>
      <Route path="/notification" element={
        <ProtectedRoute>
          <Notification/>
        </ProtectedRoute>
      }/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App