import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes'; // Update the path accordingly
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Journal from './components/Journal';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <AuthRoute path="/" element={<Home />} />
        <AuthRoute path="/register" element={<Register />} />
        <AuthRoute path="/login" element={<Login />} />
        <ProtectedRoute path="/journal" element={<Journal />} />
      </Routes>
    </Router>
  );
};

export default App;