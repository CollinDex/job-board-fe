import axios from 'axios';

const API_BASE_URL = 'https://job-board-api-production.up.railway.app/api/v1/';
//const API_BASE_URL = 'http://localhost:8000/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/signIn', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (username, email, password, role) => {
  try {
    const response = await api.post('/auth/signUp', { username, email, password, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createEmployerProfile = async (profileData) => {
  try {
    const res = await api.post('/profile/employer', profileData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

export const createJobSeekerProfile = async (profileData) => {
  try {
    const res = await api.post('/profile/job-seeker', profileData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

export const getProfile = async () => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await api.patch('/profile', profileData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

export const deleteProfile = async () => {
  try {
    const res = await api.delete('/profile');
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message
  }
};

export const postJob = async (jobData) => {
  try {
    const res = await api.post('/job-listing', jobData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getJobs = async () => {
  try {
    const res = await api.get('/job-listing');
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const editJob = async (jobData) => {
  try {
    const res = await api.patch('/job-listing', jobData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/jobs/${jobId}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file); // 'resume' should match the key expected by the backend

    const response = await api.post('/profile/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createJob = async (payload) => {
  try {
    const response = await api.post('/jobs', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getJobDetails = (id) => api.get(`/jobs/${id}`);
export const applyForJob = (jobId) => api.post(`/jobs/${jobId}/apply`);
export const getEmployerJobs = () => api.get('/employer/jobs');
export const getJobSeekerApplications = () => api.get('/jobseeker/applications');

export default api;