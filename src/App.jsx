import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Start from './pages/Start'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import DriverSignup from './pages/DriverSignup'
import DiverLogin from './pages/DiverLogin'
import Home from './pages/Home'
import UserProtectedRoute from './UserProtectedRoute'
import DriverProtectedRoute from './DriverProtectedRoute'
import UserLogout from './pages/UserLogout'
import DriverHome from './pages/DriverHome'
import DriverLogout from './pages/DriverLogout'
import Riding from './pages/Riding'
import DriverRiding from './pages/DriverRiding'
import Profile from './pages/Profile'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/home" element={<UserProtectedRoute> <Home/></UserProtectedRoute>}/>
        <Route path="/userlogout" element={<UserProtectedRoute> <UserLogout/></UserProtectedRoute>}/>
        <Route path="/" element={<Start/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/riding" element={<Riding/>}/>
        <Route path="/driverriding" element={<DriverRiding/>}/>
        <Route path="/usersignup" element={<UserSignup/>}/>
        <Route path="/userlogin" element={<UserLogin/>}/>
        <Route path="/driversignup" element={<DriverSignup/>}/>
        <Route path="/driverlogin" element={<DiverLogin/>}/>
        <Route path="/driverhome" element={<DriverHome/>}/>
        <Route path="/driverlogout" element={<DriverProtectedRoute><DriverLogout/></DriverProtectedRoute>}/>


      </Routes>
    </div>
  )
}

export default App
