import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Change the URL if your backend runs on a different port

export const registerUser = async (userData: { username: string; email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data; // This should return the token
};

export const getUserById = async (userId: string, token: string) => {
  const response = await axios.get(`${API_URL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in headers
    },
  });
  return response.data;
};