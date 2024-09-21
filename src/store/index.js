import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer, { logout } from './authSlice';
import jobsReducer from './jobsSlice';
import profileReducer from './profileSlice';

// Combine all the reducers
const appReducer = combineReducers({
  auth: authReducer,
  jobs: jobsReducer,
  profile: profileReducer,
});

// Create a root reducer that clears the state on logout
const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    state = undefined; // Reset the state
    localStorage.removeItem('user'); // Clear user from localStorage
    localStorage.removeItem('token'); // Clear token from localStorage
  }
  return appReducer(state, action);
};

// Configure the store with the rootReducer
export const store = configureStore({
  reducer: rootReducer,
});
