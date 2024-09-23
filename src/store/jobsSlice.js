// src/store/jobsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    postedJobs: [],
    appliedJobs: [],
    keyword: {},
    loading: false,
    error: null,
  },
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setPostedJobs: (state, action) => {
      state.postedJobs = action.payload;
    },
    setAppliedJobs: (state, action) => {
      state.appliedJobs = action.payload;
    },
    setKeyword: (state, action) => {
      state.keyword = action.payload;
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
    deleteJobInStore: (state, action) => {
      const jobIdToDelete = action.payload;
      state.jobs = state.jobs.filter((job) => job._id !== jobIdToDelete);
    },
  },
});

export const { setJobs, setKeyword, setPostedJobs, setAppliedJobs, setLoading, setError, updateJobInStore, deleteJobInStore } = jobsSlice.actions;

export default jobsSlice.reducer;
