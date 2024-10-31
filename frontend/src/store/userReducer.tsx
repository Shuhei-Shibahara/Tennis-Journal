import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null; // Change 'id' to 'userId'
}

const initialState: UserState = {
  userId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId; // Use 'userId' here
    },
    logout: (state) => {
      state.userId = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
