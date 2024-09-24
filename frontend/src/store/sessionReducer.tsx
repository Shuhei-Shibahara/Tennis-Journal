import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string; // Change to username
}

interface SessionState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null; // Store JWT token here
}

const initialState: SessionState = {
  user: null,
  isLoggedIn: false,
  token: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user; // Store user info
      state.token = action.payload.token; // Store the token
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.token = null; // Clear token on logout
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;