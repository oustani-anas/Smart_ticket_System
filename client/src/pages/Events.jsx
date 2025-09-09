
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import EventCardBootstrap from '../components/EventCardBootstrap';
import { Container } from "react-bootstrap"
import '../styles/Events.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api/axios';

function Events() {
    const [events, setEvents] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [count, setCount] = useState(0);
    
    useEffect( () => {
        api.get('/events/getall')
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
       try {
        api.post(
          "/payment/create-checkout-session",
          { eventId: eventId }
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
