// components/EventCard.jsx
import React from 'react';
import '../styles/EventCard.css';

export default function EventCard({ event, isExpanded, onToggle, onBuy }) {
  return (
    <div className="event-card">
      <div className="event-header">
        <h3 className="event-title">{event.name}</h3>
        <span className="event-price">{event.price ? `$${event.price}` : 'Free'}</span>
      </div>

      <p className="event-location">📍 {event.location}</p>
      <p className="event-time">🕒 {new Date(event.startTime).toLocaleString()}</p>

      <div className="event-description-container">
        {isExpanded ? (
          <p className="event-description">{event.description}</p>
        ) : (
          <button className="toggle-desc-btn" onClick={() => onToggle(event.id)}>
            Show Description
          </button>
        )}
      </div>

      <button className="buy-ticket-btn" onClick={() => onBuy(event.id)}>
        🎟 Buy Ticket
      </button>
    </div>
  );
}
