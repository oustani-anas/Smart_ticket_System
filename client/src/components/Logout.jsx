
import React, { useEffect } from 'react'
import "../styles/Logout.css";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';


const Logout = () => {

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/logout', ({withCredentials: true}))
    .then(() => {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    })
    .catch((err) => {
      console.error('Logout Error: ', err);
      navigate('/login');
    });
  }, []);


  return (
    <div className='logout-main'>
    <h1>Logout Successful!</h1>
    <p>You will be redirected to the landing page in 2 seconds...</p>
  </div>
  )
}

export default Logout