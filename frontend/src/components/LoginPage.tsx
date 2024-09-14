import React, { useState } from 'react';
import { loginUser } from '../api/axiosInstance'; // Adjust the path as needed

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email, password });
      console.log('Logged in:', data); // Store token as needed (e.g., in local storage)
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

// Exporting the LoginPage instead of LoginComponent
const LoginPage: React.FC = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginComponent />
    </div>
  );
};

export default LoginPage;