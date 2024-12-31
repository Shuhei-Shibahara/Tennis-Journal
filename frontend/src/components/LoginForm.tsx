import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/sessionReducer';
import { authService } from '../services/api';
import { LoginFormData } from '../types';
import Input from './shared/Input';
import Button from './shared/Button';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { user, token } = await authService.login(data);
      localStorage.setItem('token', token);
      dispatch(login({ user, token }));
      navigate('/journal');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-lg">
      {errorMessage && (
        <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        register={register}
        error={errors.email?.message}
        placeholder="Enter your email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        register={register}
        error={errors.password?.message}
        placeholder="Enter password"
      />

      <Button type="submit" variant="primary" fullWidth>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
