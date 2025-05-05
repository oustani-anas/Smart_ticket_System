// src/components/Auth/SignIn.js
import React, { useState } from 'react';
import AuthForm from './AuthForm';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your backend signin endpoint
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password,
      });
      console.log('Sign in successful:', response.data);
      // Handle successful signin (e.g., store token, redirect)
    } catch (error) {
      console.error('Sign in failed:', error.response?.data || error.message);
    }
  /*const handleForgotPassword = async (e) => {
    try {
      const response = axios.post('http://localhost:4000/auth/forgot-password', {
        email,
        });
        }
        catch(error) {
          console.error('Forgot password failled:', error.response?.data || error.message)
      }
    }*/
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log('the forgot password button clicked for email: ', email); 
  }

  const HandleGoogleSignIn = (e) => {
    window.location.href = 'http://localhost:4000/auth/google';
  }
  
  return (
    <AuthForm title="Sign In" onSubmit={handleSubmit} buttonText="Sign In">
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
      <a
        href="#Forgot Password?"
        onClick={handleForgotPassword}
        style={styles.forgotLink}
      >
        Forgot Password?
      </a>
    </AuthForm>
  );
};

const styles = {
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  forgotLink: {
    textAlign: 'right',
    fontSize: '14px',
    color: '#007bff',
    textDecoration: 'none',
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

export default SignIn;