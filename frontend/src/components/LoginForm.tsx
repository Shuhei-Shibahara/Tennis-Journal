import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface LoginFormData {
  email: string; // Only email is required
  password: string; // Password is required
}

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('User logged in:', response.data);
      localStorage.setItem('token', response.data.token); // Store JWT token
      onLoginSuccess(); // Callback after successful login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email" // Specify input type as email
          {...register('email', { required: true })} // Register email field
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
        {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
        <input
          type="password"
          {...register('password', { required: true })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter password"
        />
        {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;