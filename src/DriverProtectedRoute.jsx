import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DriverDataContext } from './context/DriverContext';

function DriverProtectedRoute({ children }) {
  const [isLoading, setLoading] = useState(true);
  const { setDriver } = useContext(DriverDataContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('drivertoken');

  useEffect(() => {
    if (!token) {
      navigate('/driverlogin');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/drivers/currentDriver`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDriver(response.data.driver); 
        }
      })
      .catch((error) => {
        console.error('Error validating token or fetching driver:', error);
        localStorage.removeItem('drivertoken'); 
        navigate('/driverlogin'); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, navigate, setDriver]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>; 
}

export default DriverProtectedRoute;
