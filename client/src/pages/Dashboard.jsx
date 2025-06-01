
import React, { useEffect, useState } from 'react'
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [ data, setData ] = useState({});
  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem("auth");
      return raw && raw !== "undefined" ? JSON.parse(raw) : "";
    } catch (e) {
      return "";
    }
  });
  
  const navigate = useNavigate();

  const fetchLuckyNumber = async () => {

    let axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
    }
    };

    try {
      const response = await axios.get("http://localhost:4000/auth/validate", axiosConfig);
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      toast.error(error.message);
    }
  }


      
  useEffect(() => {
    fetchLuckyNumber();
    if(token === ""){
      navigate("/login");
      toast.warn("Please login first to access dashboard");
    }
  }, [token]);

  return (
    <>
    <Navbar/>
    <div className='dashboard-main'>
      <h1>Dashboard</h1>
      <p>Hi { data.msg }! { data.luckyNumber }</p>
      <Link to="/logout" className="logout-button">Logout</Link>
    </div>
    </>
  )
}

export default Dashboard