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
    const response = await api.get(`/api/journals/user/${userId}`);
    return response.data.journals;
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
    const response = await api.delete(`/api/journals/${entryId}`);
    return response.data;
  },
};

export default api; 