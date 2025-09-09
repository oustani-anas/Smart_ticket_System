import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import '../styles/Profile.css'; // include styles below
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setUser(res.data);
        setTickets(res.data.tickets);
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    loadProfile();
  }, []);

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <>
    <Navbar/>
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.avatar
            ? <img src={user.avatar} alt="avatar" />
            : <div className="avatar-placeholder">{user.firstname[0]}{user.lastname[0]}</div>}
        </div>
        <div className="profile-info">
          <h1>{user.firstname} {user.lastname}</h1>
          <p>{user.email}</p>
        </div>
      </div>

      <h2 className="profile-section-title">Purchased Tickets</h2>
      {tickets.length === 0 ? (
          <p className="no-tickets">You haven’t purchased any tickets yet.</p>
        ) : (
            <div className="tickets-list">
          {tickets.map(t => (
              <div key={t.id} className="ticket-card">
              <div className="ticket-details">
                <p className="ticket-event">{t.event.name}</p>
                <p className="ticket-date">{new Date(t.event.date).toLocaleDateString()}</p>
              </div>
              <button
                className="ticket-download-btn"
                onClick={() => window.open(`http://localhost:4000/ticket/download/${t.id}`)}
                >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Profile;
