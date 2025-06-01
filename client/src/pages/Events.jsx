
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar';
import EventCardBootstrap from '../components/EventCardBootstrap';
import { Container } from "react-bootstrap"
import '../styles/Events.css'
import 'bootstrap-icons/font/bootstrap-icons.css';


function Events() {
    const [events, setEvents] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [count, setCount] = useState(0);
    
    useEffect( () => {
        axios.get('http://localhost:4000/events/getall')
        .then(res => {
            setEvents(res.data.events);
            setCount(res.data.count);
        })
        
        .catch(err => console.log(err));
    }, [])

    const toggleDescription = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleBuy = (eventId) => {
      /*try {
        const res = axios.post("http://localhost:4000/payment/create-checkout-session", {
          eventId: eventId,
        })
      } catch(err) {
        console.error("error in handling payment");
        alert("error in handling payment");
        }*/
        // const token = localStorage.getItem('auth');
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuYXMubWlnb3MyMEBnbWFpbC5jb20iLCJzdWIiOiJmYWJkMWQ3OS03NDBjLTRmZDYtYmQ4ZC02NTJiNTdlZGY3NWUiLCJpYXQiOjE3NDg2MTQxMzUsImV4cCI6MTc0ODYxNzczNX0.nps9p6Wt9qp7_N2TyoMu3If-NBrAO6R0hA1u_KmgNiE" 
        console.log("token = ", token);
       try {
        axios.post(
          "http://localhost:4000/payment/create-checkout-session",
          { eventId: eventId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        ).then(res => {
          window.location.href = res.data.checkoutUrl;
        }).catch(err => {
          console.error("Error in handling payment", err);
          alert("Error in handling payment");
        });
        
        } catch(err) {
        console.error("error in handling payment");
        alert("error in handling payment");
      }
          
    }

    return (
      <>
      <Navbar/>
      <Container fluid className="pt-4">
      {/*
      <div className="events-heading">
        <h1> Available Events: </h1>
      </div>
        */}
      <div className='events-page-wrapper'>
        <div className="event-grid-wrapper">
        {events.map((event) => (
          <div key={event.id} className="event-card-container">
          <EventCardBootstrap event={event} onBuy={handleBuy} />
        </div>
        ))}
        
        </div>
      </div>

        </Container>
      </>
    );
    
}

export default Events;


