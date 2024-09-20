// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user')); // Declare the 'user' variable first

const initialState = {
  user: user || null,
  isAuthenticated: user ? true : false // Use 'false' as a default for unauthenticated users
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(state.user)); 
      localStorage.setItem('token', access_token);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user'); // Remove user from localStorage on logout
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
