import React, { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); // Redirects to the login page
  };

  return (
    <div style={containerStyle}>
      <h1>Tennis Journal</h1>
      <button style={buttonStyle} onClick={handleLoginRedirect}>
        Go to Login
      </button>
    </div>
  );
};

// Styles
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as 'column', // Type assertion for TypeScript
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

const buttonStyle: CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#4CAF50', // Green
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  transition: 'background-color 0.3s',
};

export default MainPage;