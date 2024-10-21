import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import JournalEntryForm from './components/JournalEntryForm';
import JournalEntries from './components/JournalEntries';
import Navbar from './components/Navbar';
import { logout } from './store/sessionReducer';
import { fetchUserData } from './utils/authUtils';
import { RootState } from './store';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.session.isLoggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUser = async () => {
      if (!token) {
        dispatch(logout());
        setLoading(false);
        return;
      }

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
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/journal" /> : <Login />} />
        <Route path="/journal" element={isLoggedIn ? <JournalEntryForm /> : <Navigate to="/login" />} />
        <Route path="/journal-entries" element={isLoggedIn ? <JournalEntries /> : <Navigate to="/login" />} /> {/* Changed to /journal-entries */}
      </Routes>
    </Router>
  );
};

export default App;