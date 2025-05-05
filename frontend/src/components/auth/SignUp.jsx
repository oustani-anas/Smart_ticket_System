// src/components/Auth/SignUp.js
import React, { useState } from 'react';
import AuthForm from './AuthForm';
import axios from 'axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setfirstName] = useState('');
  const [lastname, setlastName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend signup endpoint
      const response = await axios.post('YOUR_BACKEND_API/signup', {
        firstname,
        lastname,
        email,
        password,
      });
      console.log('Sign up successful:', response.data);
      // Handle successful signup (e.g., redirect to signin)
    } catch (error) {
      console.error('Sign up failed:', error.response?.data || error.message);
    }
  };

  const HandleGoogleSignIn = (e) => {
    window.location.href = 'http://localhost:4000/auth/google';
  }

  return (
    <AuthForm title="Sign Up" onSubmit={handleSubmit} buttonText="Sign Up">
      <input
        type="text"
        placeholder="firstName"
        value={firstname}
        onChange={(e) => setfirstName(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="text"
        placeholder="lastName"
        value={lastname}
        onChange={(e) => setlastName(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={styles.input}
      />
      <button
        type="button"
        onClick={HandleGoogleSignIn}
        style={{ ...styles.button, ...styles.googleButton }}
      >
        Sign up with Google
      </button>
    </AuthForm>
  );
};

const styles = {
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  googleButton: {
    backgroundColor: '#4285f4',
    marginTop: '10px',
  },
};

export default SignUp;