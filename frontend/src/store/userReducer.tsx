import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  username: string | null; // Update to username
}

const initialState: UserState = {
  id: null,
  username: null, // Set initial state for username
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username; // Use username from payload
    },
    logout: (state) => {
      state.id = null;
      state.username = null; // Reset username on logout
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;