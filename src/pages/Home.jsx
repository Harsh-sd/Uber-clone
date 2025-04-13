import  {  useContext, useEffect, useRef, useState ,  } from 'react'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRidePanel  from '../components/ConfirmRidePanel';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketDataContext } from '../context/SocketContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import { UserDataContext } from '../context/userContext';

function Home() {
  const [ pickup, setPickup ] = useState('')
  const [ destination, setDestination ] = useState('')
  const [ panelOpen, setPanelOpen ] = useState(false)
  const[vehiclepanel,setVehiclePanel]=useState(false)
  const [confirmRidePanel , setConfirmRidePanel]=useState()
  const[vehicleFound , setVehicleFound]=useState()
  //waiting for driver
  const [ waitingForDriver, setWaitingForDriver ] = useState(false)
  //Because we are storing an array of suggestions
  const [ pickupSuggestions, setPickupSuggestions ] = useState([])
  const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
  //Because we are storing an object
  const [Fare , setFare]=useState({});
  const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const vehiclePanelRef=useRef(null)
    const confirmRidePanelRef=useRef(null)
    const vehicleFoundRef=useRef(null)
    const waitingForDriverRef=useRef(null);
    //for setting the vehicle
    const [ vehicleType, setVehicleType ] = useState(null)
    const {socket}=useContext(SocketDataContext);
    const {user}=useContext(UserDataContext);
    //to store the ride data 
    const [ ride, setRide ] = useState(null)
    const navigate=useNavigate();
    useEffect(() => {
        if (user || user.id) {
            console.log("Emitting join event with user ID:", user.id);
            socket.emit("join", { userType: "User", userId:user.id });
        } else {
            console.log("User or user._id is undefined");
        }
    }, [user, socket]);
    const handleProfileClick = () => {
        
        navigate('/profile', { state: { user } });
      };
  const submitHandler = (e) => {
    e.preventDefault()
}
socket.on('ride-confirmed', ride => {
    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
})
socket.on("ride-started",ride=> {
    setWaitingForDriver(false)
    navigate('/riding', { state: { ride } })
})
const findTrip=async ()=> {
    setPanelOpen(false);
    setVehiclePanel(true);

    const token=localStorage.getItem('token');
    console.log("fare" , token);
    if (!token) {
        console.log("Token is missing! User might not be authenticated.");
        return;
    }
    const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/fare`,
        {
            params: { pickup , destination },
            headers: { Authorization: `${token}` },
        });
        console.log(response);
        if (response.status === 200 && response.data.fare) {
            setFare(response.data.fare);
            console.log("Fare:", response.data.fare); 
          } else {
            console.error("Error fetching fare: Invalid response or missing fare data");
          }
    
}
const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
        const token = localStorage.getItem("token");
       // console.log(token);
        if (!token) {
            console.log("Token is missing! User might not be authenticated.");
            return;
        }

        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
            {
                params: { input: e.target.value },
                headers: { Authorization: ` ${token}` },
            }
        );

       //console.log(response);

        if(response.status==200){

            setPickupSuggestions(response.data.suggestions || []);
        }
        else {
            console.log("Error fetching pickup suggestions:");

        }
        setDestinationSuggestions([]); 
    } catch (error) {
        console.log("Error fetching pickup suggestions:");
        
    }
};

const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
        
        const token = localStorage.getItem("token");
      //  console.log(token);
        if (!token) {
            console.log("Token is missing! User might not be authenticated.");
            return;
        }

        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
            {
                params: { input: e.target.value },
                headers: { Authorization: ` ${token}` },
            }
        );
          if(response.status==200){

              setDestinationSuggestions(response.data.suggestions || []);
          }
          else {
            console.log("Destination not fetched")
          }
          setPickupSuggestions([]); 
    } catch (error) {
        console.log("Error fetching destination suggestions:");
      
    }
};

    async  function createRide(){
        const token = localStorage.getItem("token");
        //  console.log(token);
          if (!token) {
              console.log("Token is missing! User might not be authenticated.");
              return;
          }
          if (!vehicleType) {
            console.log('No vehicle type selected.');
            return;
          }
            const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/create`,
                {pickup ,destination,vehicleType},
                {
                 headers:{Authorization:`${token}`}
                }
            );
            console.log(response.data);
        }


useGSAP(function () {
    if (panelOpen) {
        gsap.to(panelRef.current, {
            height: '70%',
            padding: 24
            // opacity:1
        })
        gsap.to(panelCloseRef.current, {
            opacity: 1
        })
    } else {
        gsap.to(panelRef.current, {
            height: '0%',
            padding: 0
            // opacity:0
        })
        gsap.to(panelCloseRef.current, {
            opacity: 0
        })
    }
}, [ panelOpen ])

useGSAP(function(){
    if(vehiclepanel){
        gsap.to(vehiclePanelRef.current, {
            translateY: '0',
            duration: 0.5
          })
    }
    else {
        gsap.to(vehiclePanelRef.current, {
            translateY: '100%',
            duration: 0.5
          })
        }
    }, [vehiclepanel])

    useGSAP(function(){
        if(confirmRidePanel){
            gsap.to(confirmRidePanelRef.current, {
                translateY: '0',
                duration: 0.5
              })
        }
        else {
            gsap.to(confirmRidePanelRef.current, {
                translateY: '100%',
                duration: 0.5
              })
            }
        }, [confirmRidePanel])
 
        useGSAP(function(){
            if(vehicleFound){
                gsap.to(vehicleFoundRef.current, {
                    translateY: '0',
                    duration: 0.5
                  })
            }
            else {
                gsap.to(vehicleFoundRef.current, {
                    translateY: '100%',
                    duration: 0.5
                  })
                }
            }, [vehicleFound])


            useGSAP(function () {
                if (waitingForDriver) {
                    gsap.to(waitingForDriverRef.current, {
                        transform: 'translateY(0)'
                    })
                } else {
                    gsap.to(waitingForDriverRef.current, {
                        transform: 'translateY(100%)'
                    })
                }
            }, [ waitingForDriver ])
  return (
    <div  className="bg-[url('https://i0.wp.com/www.cssscript.com/wp-content/uploads/2018/03/Simple-Location-Picker.png?fit=561%2C421&ssl=1')] h-screen w-full bg-red-400 flex flex-col justify-between">

<div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
              /*profile page/*
            <button
          onClick={handleProfileClick}
          className="absolute right-5 top-5 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <i className="ri-user-line text-2xl"></i> 
        </button>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                        
                        setPickup('')
                        setDestination('')
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                       
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                               
                                setDestinationSuggestions([])
                                
                                
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                 
                                setPickupSuggestions([])
                                
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <div>
                    {pickup && destination && (
              <button
                onClick={findTrip}
                className='bg-black text-white px-4 py-2 rounded-lg w-full  mb-5'>
                Find Trip
              </button>
            )}
                     </div>
                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel}
                    pickupSuggestions={pickupSuggestions} destinationSuggestions={destinationSuggestions}
                    setPickup={setPickup} setDestination={setDestination}/>
                </div>
                <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel   selectVehicle={setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} fare={Fare}/>
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePanel 
                 setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel}   createRide={createRide} pickup={pickup}  destination={destination} fare={Fare} vehicleType={vehicleType}/>
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <LookingForDriver  setVehicleFound={setVehicleFound} pickup={pickup}  destination={destination} fare={Fare} vehicleType={vehicleType}  />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <WaitingForDriver  ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver}/>
            </div>
            </div>
    </div>
    </div>
  );
}

export default Home;
