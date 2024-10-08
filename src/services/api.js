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

export const deleteJob = async (job_id) => {
  try {
    const res = await api.delete('/job-listing', {
      data: { job_id }
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchJobs = async ({ jobType, location, keyword, status, min_salary, max_salary }) => {
  try {
    let queryParams = new URLSearchParams();

    if (jobType) queryParams.append('job_type', jobType);
    if (location) queryParams.append('location', location);
    if (keyword) queryParams.append('keyword', keyword);
    if (status) queryParams.append('status', status);
    if (min_salary) queryParams.append('min_salary', min_salary);
    if (max_salary) queryParams.append('max_salary', max_salary);

    const res = await api.get(`/search?${queryParams.toString()}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const applyForJob = async (applicationData) => {
  try {
    const res = await api.post('/jobs', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAppliedJobs = async () => {
  try {
    const res = await api.get('/jobs/applied');
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getJobApplications = async (job_id) => {
  try {
    const res = await api.get(`/jobs/${job_id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateApplicationStatus = async (applicationId, statusData) => {
  try {
    const data = {
      application_id : applicationId,
      status: statusData
    };
    const res = await api.put('/jobs/status', data);
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;