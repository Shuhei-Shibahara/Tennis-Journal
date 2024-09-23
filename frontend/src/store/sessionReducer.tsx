import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  // Add other user properties as needed
}

interface SessionState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: SessionState = {
  user: null,
  isLoggedIn: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;