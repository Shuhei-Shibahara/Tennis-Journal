import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
}

const initialState: UserState = {
  id: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.id = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;