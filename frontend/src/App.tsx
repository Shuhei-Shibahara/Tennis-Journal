import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage'; // Adjust the path as needed
import LoginPage from './components/LoginPage'; // Assuming you have a LoginPage component

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;