
import React, { useContext  } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserDataContext } from '../context/userContext';
import axios from 'axios';
  function UserSignup() {
  const [email , setEmail]=useState("");
  const [password ,setPassword]=useState("");
  const[firstName ,setFirstName]=useState("");
  const[lastName ,setLastName]=useState("");
   const navigate=useNavigate();
  const { setUser}=useContext(UserDataContext);

  const submitHandler= async (e)=> {
    e.preventDefault();
    console.log(email , password ,firstName ,lastName);
      const newUser={
        fullName:{
          firstName:firstName,
          lastName:lastName
        },
        email:email,
        password:password
      }
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup` , newUser);
    if(response.status===201){
      const data=response.data;
      setUser(data.user);
      console.log(data.user);
      navigate("/home")
    }
    setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    
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
        <div className="w-full max-w-md  bg-slate-500 p-5 rounded shadow-md mt-3">
          <form  onSubmit={submitHandler}>
              <h3 className="text-xl font-bold pb-3">Enter your name</h3>
            <div className="flex gap-2">
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={firstName}
              onChange={(e)=>setFirstName(e.target.value)}
              type="text"
              placeholder="Firstname"
            />
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={lastName}
              onChange={(e)=>setLastName(e.target.value)}
              type="text"
              placeholder="Lastname"
            />
            </div>
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
              Signup
            </button>
          </form>

          <div className="flex justify-center items-center flex-col mt-5">
            <p className="text-black text-lg">Already have an account?</p>
            <Link
              to="/userlogin"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Login Here
            </Link>
          </div>
        </div>
        
      </main>
      <footer className="p-3 text-center  text-gray-500 text-sm bg-black">
        © 2025 Uber. All rights reserved.
      </footer>
    </div>
  );
}

export default UserSignup;

