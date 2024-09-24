import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  username: string | null; 
}

const initialState: UserState = {
  id: null,
  username: null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username; 
    },
    logout: (state) => {
      state.id = null;
      state.username = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;