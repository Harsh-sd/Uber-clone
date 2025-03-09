import React from 'react'
import { useNavigate } from 'react-router-dom';
function UserProtectedRoute({children}) {
    const navigate=useNavigate();
    const token=localStorage.getItem("token");
    //console.log(token);
    if(!token){
      navigate("/userlogin");
    }
    return (
    <div>
      {children}
    </div>
  )
}
export default UserProtectedRoute

