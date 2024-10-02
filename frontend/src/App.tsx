import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Journal from './components/Journal';
import Navbar from './components/Navbar';
import { logout } from './store/sessionReducer';
import { fetchUserData } from './utils/authUtils'; // Import the utility function
import { RootState } from './store';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.session.isLoggedIn);
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    const fetchUser = async () => {
      if (!token) {
        console.log('No token found, logging out');
        dispatch(logout());
        setLoading(false);
        return;
      }

      // Fetch user data using the utility function
      await fetchUserData(token, dispatch);
      setLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/journal" /> : <Login />} />
        <Route path="/journal" element={isLoggedIn ? <Journal /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;