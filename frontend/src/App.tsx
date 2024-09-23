import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Journal from './components/Journal';
import Navbar from './components/Navbar';
import './index.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Update the logged-in status
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token on logout
    setIsLoggedIn(false); // Update the logged-in status
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />} // No longer checking isLoggedIn here
        />

        {/* Protected Route */}
        <Route path="/journal" element={isLoggedIn ? <Journal /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;