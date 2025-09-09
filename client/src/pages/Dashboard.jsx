
import React, { useEffect, useState } from 'react';
import "../styles/Dashboard.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Dashboard = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await api.get('/auth/logout', { withCredentials: true });
    toast.success("Logged out successfully.");
    navigate('/login');
  } catch (err) {
    toast.error("Logout failed.");
    console.error('Logout Error: ', err);
    navigate('/login');
  }
};

  
  const fetchLuckyNumber = async () => {
    try {
      const response = await api.get("/auth/validate");
      setData({ msg: response.data.msg, luckyNumber: response.data.secret });
    } catch (error) {
      // If token is invalid or expired
      if (error.response && error.response.status === 401) {
        toast.warn("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Error fetching data.");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchLuckyNumber();
  }, []);

  return (
    <>
      <Navbar />
      <div className="dashboard-main">
        <h1>Dashboard</h1>
        <p>Hi {data.msg}! {data.luckyNumber}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </>
  );
};

export default Dashboard;
