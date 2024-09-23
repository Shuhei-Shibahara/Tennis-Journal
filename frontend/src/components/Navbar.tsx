import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC<{ isLoggedIn: boolean; onLogout: () => void }> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    onLogout(); // Call the logout function passed as a prop
    navigate('/'); // Redirect to the homepage or login page after logout
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">My App</h1>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;