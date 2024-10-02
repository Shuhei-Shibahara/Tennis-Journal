import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../store/sessionReducer'; // Assuming you have a login action in your session reducer

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Register the user
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('User registered:', registerResponse.data);

      // Automatically log in the user after registration
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: data.email,
        password: data.password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { user, token } = loginResponse.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Dispatch login action to store user info in Redux state
      dispatch(login({ user, token }));

      // Fetch user data after logging in
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT format:', token);
        dispatch(logout());
        return;
      }

      const decodedToken = JSON.parse(atob(parts[1]));
      console.log('Decoded token:', decodedToken);

      const userId = decodedToken.id; // Ensure this matches your login/registration response
      if (!userId) {
        console.error('User ID not found in token:', decodedToken);
        dispatch(logout());
        return;
      }

      // Fetch user data
      const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('User data fetched:', userResponse.data);
      dispatch(login({ user: userResponse.data, token }));

      // Navigate to /journal page
      navigate('/journal');
    } catch (error) {
      console.error('Registration/Login error:', error);
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