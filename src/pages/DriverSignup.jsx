import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { DriverDataContext } from "../context/DriverContext";

function DriverSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehicleSeating, setVehicleSeating] = useState("");
  const [vehicleNumberPlate, setVehicleNumberPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const navigate = useNavigate();
  const { setDriver } = useContext(DriverDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newDriver = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
      phoneNumber,
      licenseNumber,
      vehicle: {
        color: vehicleColor,
        seating: vehicleSeating,
        numberPlate: vehicleNumberPlate,
        vehicleType: vehicleType,
      },
    };
         const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/drivers/registerDriver`,newDriver);
      if (response.status === 201) {
        const data = response.data;
        setDriver(data.savedDriver);
        navigate("/driverhome");
      }
     
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
      setLicenseNumber("");
      setVehicleColor("");
      setVehicleSeating("");
      setVehicleNumberPlate("");
      setVehicleType("");
    
  };

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
        <div className="w-full max-w-md bg-slate-500 p-5 rounded shadow-md mt-3">
          <form onSubmit={submitHandler}>
            <h3 className="text-xl font-bold pb-3">Enter your name</h3>
            <div className="flex gap-2">
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                placeholder="Firstname"
              />
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                placeholder="Lastname"
              />
            </div>
            <h3 className="text-xl font-bold pb-3">Enter your email</h3>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="abc@gmail.com"
            />
            <h3 className="text-xl font-bold pb-3">Enter your password</h3>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />
            <h3 className="text-xl font-bold pb-3">Enter your phone number</h3>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
              placeholder="Phone Number"
            />
            <h3 className="text-xl font-bold pb-3">Enter your license number</h3>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded"
              required
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              type="text"
              placeholder="License Number"
            />
            <h3 className="text-xl font-bold pb-3">Vehicle Information</h3>
            <div className="flex gap-2">
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                type="text"
                placeholder="Color"
              />
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={vehicleSeating}
                onChange={(e) => setVehicleSeating(e.target.value)}
                type="number"
                placeholder="Seating Capacity"
              />
            </div>
            <div className="flex gap-2">
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={vehicleNumberPlate}
                onChange={(e) => setVehicleNumberPlate(e.target.value)}
                type="text"
                placeholder="Number Plate"
              />
              <input
                className="w-full p-3 mb-4 border border-gray-300 rounded"
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                type="text"
                placeholder="Vehicle Type"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-between text-center bg-black text-white py-2 px-10 ml-20 rounded mb-4 hover:bg-gray-800 transition-all"
            >
              Create New Account
            </button>
          </form>
          <div className="flex justify-center items-center flex-col mt-5">
            <p className="text-black text-lg">Already have an account?</p>
            <Link
              to="/driverlogin"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
            >
              Login Here
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-3 text-center text-gray-500 text-sm bg-black">
        © 2025 Uber. All rights reserved.
      </footer>
    </div>
  );
}

export default DriverSignup;
