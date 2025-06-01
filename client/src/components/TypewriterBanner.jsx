import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import "../styles/TypeWriter.css"

const TypewriterBanner = () => {
  return (
    <div style={{
      position: 'absolute',
      left: '50px',
      top: '40px',
      color: 'green',
      fontSize: '50px',
      fontWeight: 'bold',
      zIndex: 10
    }}>
      <Typewriter
        words={['Smart Ticket System', 'Face Recognition Login', 'Secure and Fast']}
        loop={0}
        cursor
        cursorStyle="_"
        typeSpeed={80}
        deleteSpeed={50}
        delaySpeed={1500}
      />
    </div>
  );
};

export default TypewriterBanner;
