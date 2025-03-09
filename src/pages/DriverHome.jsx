import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import DriverDetails from '../components/DriverDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketDataContext } from '../context/SocketContext'
import { DriverDataContext } from '../context/DriverContext'

const DriverHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
     const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    //to take the data from the user side when ride is created 
    const [ride ,setRide]=useState(null);
    const {socket}=useContext(SocketDataContext);
    const {driver}=useContext(DriverDataContext)
    //This is  to connect with the Driver to update the socketId in the model on the page reload
    useEffect(()=> {
        console.log(" Emitting join event for driver:", driver.id);
        socket.emit("join",{userType:"Driver" , userId:driver.id})
       
        socket.on("connect", () => {
        console.log(" Socket connected with ID:", socket.id);
                });
         
        
    },[driver , socket]);
    //To update the location of the driver that has to be provided to the user when he is looking for driver
    const updateLocation = () => {
        if (navigator.geolocation) {  // geolocation is available in the browser
            navigator.geolocation.getCurrentPosition(position => {
                
                socket.emit('update-driver-location', {  
                    driverId: driver.id,  
                    location: {          
                        ltd: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
            });
        }
    };
    
    const locationInterval = setInterval(updateLocation, 10000); 
    updateLocation(); 
    
   //return () => clearInterval(locationInterval) // (commented out) Cleanup function if needed
   //on is used to listen to the data
    socket.on("new-ride" ,(data)=> {
        console.log("Ride data received from server:", data);
        setRidePopupPanel(true);
        setRide(data);
       // console.log("setride:" , setRide);
    } )
    //function to confirm the ride
    async function confirmRide() {
        try {
            console.log("Ride Object:", ride);
        console.log("Driver Object:", driver);
        console.log("Stored Token:", localStorage.getItem('token'));
            // Check if ride and driver exist before making the request
            if ( !ride._id ) {
                console.error("Error: Ride  ID is missing");
                return;
            }
            if ( !driver.id) {
                console.error("Error: Driver ID is missing");
                return;
            }
    
            
    
            
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/ride/confirmride`,
                {
                    rideId: ride._id,
                    driverId:driver.id
                },
                {
                    headers: {
                        Authorization:`${localStorage.getItem('token')}`,
                    },
                }
            );
             console.log("Ride confirmed successfully:", response.data);
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
            
        } catch (error) {
            console.error("Error confirming ride:", error.response?.data || error.message);
            alert("Failed to confirm ride. Please try again.");
        }
    }
    
      useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
      if (confirmRidePopupPanel) {
          gsap.to(confirmRidePopupPanelRef.current, {
              transform: 'translateY(0)'
          })
      } else {
          gsap.to(confirmRidePopupPanelRef.current, {
              transform: 'translateY(100%)'
          })
      }
  }, [ confirmRidePopupPanel ])

    

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/driverhome' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />

            </div>
            <div className='h-2/5 p-6'>
                <DriverDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                ride={ride}
                setRidePopupPanel={setRidePopupPanel} 
                setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                confirmRide={confirmRide}
                 />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} ride={ride}
                 />
            </div>
           
        </div>
    )
}

export default DriverHome
