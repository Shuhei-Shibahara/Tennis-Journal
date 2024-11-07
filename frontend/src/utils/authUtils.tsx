import axios from 'axios';
import { logout, login } from '../store/sessionReducer';
import { AppDispatch } from '../store'; // Adjust based on your store setup

export const fetchUserData = async (token: string, dispatch: AppDispatch) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Invalid JWT format:', token);
    dispatch(logout());
    return null;
  }

  const decodedToken = JSON.parse(atob(parts[1]));
  console.log('Decoded token:', decodedToken); // Ensure this logs the expected userId.

  const userId = decodedToken.userId; // Ensure this matches the key in your token payload.
  if (!userId) {
    console.error('User ID not found in token:', decodedToken);
    dispatch(logout());
    return null;
  }

  // Log the token being sent
  console.log('Sending token:', token);
  const apiUrl = process.env.REACT_APP_API_URL

  try {
    const response = await axios.get(`${apiUrl}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User data fetched:', response.data);
    dispatch(login({ user: response.data, token }));
    return response.data; // Return user data if needed
  } catch (error) {
    console.error('Error fetching user:', error);
    dispatch(logout());
    return null;
  }
};
