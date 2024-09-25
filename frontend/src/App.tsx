import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Journal from './components/Journal';
import Navbar from './components/Navbar';
import { login, logout } from './store/sessionReducer';
import axios from 'axios';
import { RootState } from './store';
import './index.css';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true); // Loading state, but we won't display anything for it
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.session.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        console.log(decodedToken);
        const userId = decodedToken.id;

        try {
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          dispatch(login({ user: response.data, token }));
        } catch (error) {
          console.error('Failed to fetch user', error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setLoading(false); // Set loading to false once token/user check is done
    };

    fetchUser();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
  };

  // Don't render anything until the token/user check is finished
  if (loading) {
    return null; // Return nothing while loading
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