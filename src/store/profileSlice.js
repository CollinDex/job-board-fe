import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Action to set the profile in the state
    setProfile: (state, action) => {
      state.profile = action.payload;
    },      
    
    // Action to set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

// Export actions for use in components
export const { setProfile, setLoading } = profileSlice.actions;

// Export the reducer for the store
export default profileSlice.reducer;
