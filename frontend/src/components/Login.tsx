import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data); // Replace with your backend URL
      console.log('User logged in:', response.data);
      // Store the JWT token in localStorage or state
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl mb-4">Login</h2>
        <div className="mb-2">
          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: true })}
            className="border p-2 w-full"
          />
          {errors.email && <p className="text-red-500">Email is required</p>}
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="border p-2 w-full"
          />
          {errors.password && <p className="text-red-500">Password is required</p>}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 mt-2">Login</button>
      </form>
    </div>
  );
};

export default Login;