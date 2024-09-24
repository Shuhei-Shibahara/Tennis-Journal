import React from 'react';
import LoginForm from './LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600 mb-8">Login</h1>
      <LoginForm />
    </div>
  );
};

export default Login;