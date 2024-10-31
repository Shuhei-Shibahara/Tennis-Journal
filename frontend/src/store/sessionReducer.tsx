import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  userId: string; // change _id to userId
}

interface SessionState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
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
      console.log('Logging in user:', action.payload.user);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout(state) {
      console.log('Logging out user');
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
