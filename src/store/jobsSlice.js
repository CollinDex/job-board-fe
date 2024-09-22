// src/store/jobsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateJobInStore: (state, action) => {
      const updatedJob = action.payload;
      const index = state.jobs.findIndex((job) => job.job_id === updatedJob.job_id);
      if (index !== -1) {
        state.jobs[index] = updatedJob;
      }
    },
  },
});

export const { setJobs, setLoading, setError, updateJobInStore } = jobsSlice.actions;

export default jobsSlice.reducer;
