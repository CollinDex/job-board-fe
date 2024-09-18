import axios from 'axios';

const API_URL = 'https://job-board-api-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getJobs = (params) => api.get('/jobs', { params });
export const getJobDetails = (id) => api.get(`/jobs/${id}`);
export const createJob = (jobData) => api.post('/jobs', jobData);
export const applyForJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const getEmployerJobs = () => api.get('/employer/jobs');
export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);
export const getJobSeekerApplications = () => api.get('/jobseeker/applications');

export default api;