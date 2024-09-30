import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/sessionReducer';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { user, token } = response.data; // Assuming backend returns token & user
      console.log(user, token);
      // Store token and dispatch login action
      localStorage.setItem('token', token);
      dispatch(login({ user, token })); // Use the login action
      navigate('/journal'); // Redirect to the journal page
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <div className="mb-4">
          <label className="block mb-1 text-gray-600">Username</label>
          <input
            {...register('username', { required: true })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
          {errors.username && <p className="text-red-500 text-sm">Username is required</p>}
        </div>

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