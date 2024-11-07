import React, { useState } from 'react'; // Import useState
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/sessionReducer';
import { fetchUserData } from '../utils/authUtils';

interface RegisterFormData {
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const onSubmit = async (data: RegisterFormData) => {
    const apiUrl = process.env.REACT_APP_API_URL

    try {
      const registerResponse = await axios.post(`${apiUrl}/api/auth/register`, data, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('User registered:', registerResponse.data);

      const loginResponse = await axios.post(`${apiUrl}/api/auth/login`, {
        email: data.email,
        password: data.password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { user, token } = loginResponse.data;

      localStorage.setItem('token', token);
      dispatch(login({ user, token }));

      // Fetch user data
      await fetchUserData(token, dispatch);

      navigate('/journal');
    } catch (error) {
      console.error('Registration/Login error:', error);

      // Set the error message from the response
      if (axios.isAxiosError(error) && error.response) {
        // Check for specific error messages from the backend
        const errorResponse = error.response.data.message;
        if (errorResponse.includes('duplicate key error')) {
          setErrorMessage('This email address is already registered.');
        } else {
          setErrorMessage(errorResponse || 'Registration failed');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>} {/* Error message display */}

        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-gray-600">Password</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;