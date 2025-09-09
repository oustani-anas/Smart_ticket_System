
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios'; // Your axios instance
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/PaymentSuccess.css'

export default function PaymentSuccess() {
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
  const sessionId = searchParams.get('session_id');
  if (sessionId) {
    api.get(`/ticket/ticket-id/${sessionId}`)
      .then(res => {
        setTicketId(res.data.ticketId);
      })
      .catch(() => {
        console.error('Failed to fetch ticket ID');
      });
  }
}, [searchParams]);
  return (
    <>
      <Navbar />
      <div className="payment-success-container">
        <h2 className="payment-message">🎉 Payment Successful!</h2>
        {ticketId ? (
          <a
            href={`http://localhost:4000/ticket/download/${ticketId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-button"
          >
            Download Ticket PDF
          </a>
        ) : (
          <p>Loading ticket...</p>
        )}
      </div>
    </>
  );
}
