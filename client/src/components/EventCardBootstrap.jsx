
import React, { useState } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import '../styles/EventCardBootstrap.css';
import eventImage from "../assets/event.png"

const EventCard = ({ event, onBuy }) => {
  const [showDescription, setShowDescription] = useState(false);

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="event-card shadow-sm mb-4">
      <Card.Img 
        variant="top" 
        //src={event.imageUrl} 
        src = {eventImage}
        alt={event.name} 
        className="event-card-image"
      />
      <Card.Body>
        <Card.Title className="event-card-title">{event.name}</Card.Title>
        
        <div className="event-card-details">
          <div className="d-flex justify-content-between">
            <div>
              <i className="bi bi-geo-alt-fill me-2 text-muted"> </i>
              <span>{event.location}</span>
            </div>
            <div className="text-success fw-bold">
              ${event.price.toFixed(2)}
            </div>
          </div>
          
          <div className="mt-2 text-muted">
            <i className="bi bi-calendar-check me-2"> </i>
            {formatDateTime(event.startTime)}
          </div>
        </div>

        <Button 
          className="btn-show-description mt-3 w-100"
          size="sm"
          onClick={() => setShowDescription(!showDescription)}
          >
          {showDescription ? ' Hide Description ' : ' Show Description '}
        </Button>

        <Collapse in={showDescription}>
          <div className="mt-3">
            <Card.Text className="event-description">
              {event.description}
            </Card.Text>
          </div>
        </Collapse>
          <Button
            variant="success"
            className="mt-3 w-100 buy-ticket-btn"
            onClick={() => onBuy(event.id)}
          >
            Buy Ticket
          </Button>

      </Card.Body>
    </Card>
  );
};

export default EventCard;