import React from 'react';
import LoginForm from './LoginForm';

const Home: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 border-2 border-gray-400 shadow-lg">
      <h1 className="text-5xl font-bold text-blue-600 mb-8">Tennis Journal</h1>
      <LoginForm /> 
    </div>
  );
};

export default Home;