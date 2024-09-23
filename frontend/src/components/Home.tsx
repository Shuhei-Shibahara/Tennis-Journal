import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm'; // Import the reusable component

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 border-2 border-gray-400 shadow-lg">
      <h1 className="text-5xl font-bold text-blue-600 mb-8">Tennis Journal</h1>

      <div className="cursor-pointer mb-6" onClick={() => navigate('/login')}>
        <img src="/path-to-your-keyhole-image.png" alt="Keyhole" className="w-20 h-20" />
      </div>

      <LoginForm onLoginSuccess={handleLoginSuccess} /> {/* Reuse LoginForm here */}
    </div>
  );
};

export default Home;