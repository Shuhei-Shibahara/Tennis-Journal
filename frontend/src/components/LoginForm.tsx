import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/sessionReducer'; // Adjust the import path as needed

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { user, token } = response.data; // Assuming your backend sends back user info and token

      localStorage.setItem('token', token); // Store JWT token

      // Dispatch login action with user data and token
      dispatch(login({ user, token }));

      // No need to call onLoginSuccess, as navigation is handled in Login.tsx
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          {...register('email', { required: true })}
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