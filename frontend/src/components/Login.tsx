import React from 'react';
import LoginForm from './LoginForm'; // Import the reusable component

const Login: React.FC = () => {
  const handleLoginSuccess = () => {
    console.log('Redirect to another page');
    // Handle successful login
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <LoginForm onLoginSuccess={handleLoginSuccess} /> {/* Reuse LoginForm here */}
    </div>
  );
};

export default Login;