// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css'; // make sure this path matches your file
import Events from '../pages/Events';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Smart System Ticket</div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}
