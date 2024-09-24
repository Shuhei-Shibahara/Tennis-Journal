import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Journal from './components/Journal';
import Navbar from './components/Navbar';
import { logout } from './store/sessionReducer';
import { RootState } from './store';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.session.isLoggedIn);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      if (token) {
        console.log('am here')
      } else {
        dispatch(logout());
        console.log('logged out')
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('logging out now')
    dispatch(logout());
  };

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