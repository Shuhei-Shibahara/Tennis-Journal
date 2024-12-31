import axios from 'axios';
import { API_URL } from '../constants';
import { JournalEntry, LoginFormData, RegisterFormData } from '../types';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data: LoginFormData) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormData) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },
};

export const journalService = {
  getEntries: async (userId: string) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await api.get(`/api/journals/user/${userId}`);
      return response.data.journals;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
      throw error;
    }
  },

  createEntry: async (data: Omit<JournalEntry, 'entryId'>) => {
    const response = await api.post('/api/journals', data);
    return response.data;
  },

  updateEntry: async (entryId: string, data: Partial<JournalEntry>) => {
    const response = await api.put(`/api/journals/${entryId}`, data);
    return response.data;
  },

  deleteEntry: async (entryId: string) => {
    if (!entryId) {
      throw new Error('Entry ID is required for deletion');
    }

    try {
      console.log('Attempting to delete entry:', { entryId, url: `/api/journals/${entryId}` });
      const response = await api.delete(`/api/journals/${entryId}`);
      
      if (response.status === 200) {
        console.log('Successfully deleted entry:', entryId);
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete entry');
    } catch (error: any) {
      console.error('Delete operation failed:', {
        entryId,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        url: `/api/journals/${entryId}`
      });
      throw error;
    }
  },
};

export default api; 