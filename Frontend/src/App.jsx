import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import AuthCallbackPage from "./pages/AuthCallback"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import Availability from "./pages/Availability"

function App() {

  return (
    <Routes>
      {/*login */}
      <Route path="/" element={<Login/>} />
      {/*oAuth callback - reads token from url after login */}
      <Route path="/auth/callback" element={<AuthCallbackPage/>}/>
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
    </Routes>
  )
}

export default App