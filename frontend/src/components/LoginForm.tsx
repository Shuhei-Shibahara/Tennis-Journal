import React, { useState } from 'react'; // Import useState
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/sessionReducer';
import { fetchUserData } from '../utils/authUtils';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const onSubmit = async (data: LoginFormData) => {
    const apiUrl = process.env.REACT_APP_API_URL
  
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { user, token } = response.data;

      localStorage.setItem('token', token);
      dispatch(login({ user, token }));

      // Fetch user data
      await fetchUserData(token, dispatch);

      navigate('/journal'); // Navigate to the journal page
    } catch (error) {
      console.error('Login error:', error);

      // Set the error message from the response
      if (axios.isAxiosError(error) && error.response) {
        // Check for specific error messages from the backend
        const errorResponse = error.response.data.message;
        if (errorResponse.includes('Invalid email or password')) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          setErrorMessage(errorResponse || 'Login failed');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
      {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>} {/* Error message display */}

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
