import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm'; // Assuming you have this component

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      onLoginSuccess(); // Update logged-in status
      navigate('/journal'); // Redirect to /journal
    }
  }, [navigate, onLoginSuccess]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600 mb-8">Login</h1>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
};

export default Login;