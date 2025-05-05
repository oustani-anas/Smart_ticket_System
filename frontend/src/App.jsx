// import logo from './logo.svg';
// import Buton from './components/Buton';
// import Card from './components/Card';
// import CardCounter from './components/CardCounter';

/*function App() {
  return (
    <div className="card-container">
      <Card cardName = {"card one"} description = {"the description of the card one"} />
      <Card cardName = {"card two"} description = {"the description of the card two"} />
      <Card cardName = {"card three"} description = {"the description of the card three"} />
      </div>
      );
      }*/
     
     
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';

const App = () => {
  return (
    <Router>
      <div>
        <nav style={styles.nav}>
          <Link to="/signin" style={styles.link}>Sign In</Link>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
        </nav>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/*<Route path="/forgot-password" element{< */}
          <Route path="/" element={<SignIn />} /> 
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  nav: {
    textAlign: 'center',
    padding: '20px',
  },
  link: {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#007bff',
  },
};


export default App;
