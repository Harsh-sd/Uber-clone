import React, { useContext } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserDataContext } from '../context/userContext';

function UserLogin() {
  const [email , setEmail]=useState("");
  const [password ,setPassword]=useState("");
  const navigate=useNavigate();
const {setUser}=useContext(UserDataContext);
  const submitHandler=async(e)=> {
    e.preventDefault();
    const userData={
      email:email , password:password
    };
    console.log(email , password);
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData, {
      withCredentials: true, // Add this if backend expects cookies important;
      });
      if(response.status===200){
  const data=response.data;
  setUser(data.user);
  console.log(data.user);
  localStorage.setItem("token" , data.token);
  navigate("/home")
}
    setEmail('');
      setPassword('');
    
  }
  return (
    <div className="h-screen w-full flex flex-col justify-between">
      
      <header className="flex justify-start p-3 bg-slate-500 shadow-md">
        <img
          className="w-20"
          src="https://download.logo.wine/logo/Uber/Uber-Logo.wine.png"
          alt="Uber Logo"
        />
      </header>

      
      <main className="flex-grow flex flex-col items-center justify-center bg-slate-800 px-5">
        <div className="w-full max-w-md  bg-slate-500 p-5 rounded shadow-md">
          <form  onSubmit={submitHandler}>
            <h3 className="text-xl font-bold pb-3">Enter your email</h3>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="abc@gmail.com"
            />
            <h3 className="text-xl font-bold pb-3">Enter your password</h3>
            <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              type="password"
              placeholder="Password"
            />
            <button type="submit"
              className="  flex items-center justify-between text-center bg-black text-white py-2 px-10 ml-20 rounded mb-4 hover:bg-gray-800 transition-all">
              Login
            </button>
          </form>

          <div className="flex justify-center items-center flex-col mt-5">
            <p className="text-black text-lg">New Here?</p>
            <Link
              to="/usersignup"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Create New Account
            </Link>
          </div>
        </div>

       
        <div className="mt-20">
          <Link
            className="block text-center border px-3 py-2 bg-yellow-200 text-black rounded hover:bg-yellow-300 transition-all"
            to="/driversignup"
          >
            Signup as Driver
          </Link>
        </div>
      </main>
      <footer className="p-3 text-center  text-gray-500 text-sm bg-black">
        © 2025 Uber. All rights reserved.
      </footer>
    </div>
  );
}

export default UserLogin;

