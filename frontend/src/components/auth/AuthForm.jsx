// src/components/Auth/AuthForm.js
import React, { useState } from 'react';

const AuthForm = ({ title, onSubmit, buttonText, children }) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleclick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  }

  return (
    <div className="auth-container" style={styles.container}>
      <h2>{title}</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        {children}
        <button type="submit" style={{
            ...styles.button,
            transform: isClicked ? 'scale(0.95)' : 'scale(1)',
            transition: 'transform 150ms ease-in-out',
          }}
          onClick={handleclick}
        >
          {buttonText}
        </button>
      </form>
    </div>
  
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AuthForm;