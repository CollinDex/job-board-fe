import axios from 'axios';

const API_BASE_URL = 'https://job-board-api-production.up.railway.app/api/v1/';

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

export const getJobs = async () => {
  try {
    const response = await api.get('/jobs');
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
export const deleteJob = (jobId) => api.delete(`/jobs/${jobId}`);
export const getJobSeekerApplications = () => api.get('/jobseeker/applications');

export default api;

/* import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import config from '@/config';
import { Experience, ProfileBody, ProfilePhotoBody } from '@/features/Profile/types/profile';
import { Schedule } from '@/features/Availability/types/schedule';
import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import { ProfessionalInformationType } from '@/libs/types/user';
import { AvailabilityData } from '@/features/Availability/components/WeeklyHoursContainer';
import { ServiceType } from '@/features/Programs/types/services';
import {
  BackendSpacesSessionData,
  SpacesAddTodo,
  SpacesAttachments,
  SpacesDescription,
  SpacesSessionData,
  SpacesSessionsStatusPayload,
} from '@/libs/SpacesContext';

import { Values as VerifyIdentityType } from '@/features/Upgrade/VerifyIdentity';
import { Values as IdentityVerificationType } from '@/features/Upgrade/IdentityVerification';
import { Values as PaymentSetupType } from '@/features/Upgrade/PaymentSetup';

export const axios = Axios.create({
  baseURL: config.API_URL,
});

export const ProfileApi = (token: string) => {
  const intance = Axios.create({
    baseURL: config.API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    deleteExperience: async (experienceId: string) => {
      return await intance.delete(`/user/delete-experience/${experienceId}`);
    },
    updateExperience: async (data, experienceId) => {
      return await intance.post(`/user/edit-experience`, data);
    },
    getExperiences: async () => {
      return await intance.get('/user/get-experiences');
    },
    createExperience: async (data: Experience) => {
      return await intance.post('/user/add-experience', data);
    },
    deleteEducation: async (educationId: string) => {
      return await intance.delete(`/user/profile/educations/${educationId}`);
    },
    updateEducation: async (data, educationId) => {
      return await intance.patch(`/user/profile/educations/${educationId}`, data);
    },
    getEducation: async () => {
      return await intance.get('/user/profile/educations');
    },
    createEducation: async (data: Experience) => {
      return await intance.post('/user/profile/educations', data);
    },
    getProfile: async () => {
      return await intance.get('/user/profile');
    },
    getProfileByUsername: async (username: string) => {
      return await intance.get(`/user/profile/${username}`);
    },
    getUserProfileById: async (userId: string) => {
      return await intance.get(`/user/get-profile-by-user-id/${userId}`);
    },
    updateProfile: async (data: ProfileBody) => {
      return await intance.post('/user/profile', data);
    },
    updateProfilePhoto: async (data: ProfilePhotoBody) => {
      return await intance.post('/user/add-profile-image', data);
    },
    updateUsername: async (data: ProfilePhotoBody) => {
      return await intance.patch('/user/username', data);
    },
    getProfessionalInformation: async (userId: string) => {
      return await intance.get(`/become-professional/get-professional-information/${userId}`);
    },
    getUserProfile: async () => {
      return await intance.get('/auth/user-profile');
    },
    getAreaOfSpecialisation: async () => {
      return await intance.get('/get-area-of-specialization');
    },
    getAllLanguages: async () => {
      return await intance.get('/get-languages');
    },
    addBioDetails: async (data: any) => {
      return await intance.post('/user/add-bio-details', data);
    },
    createUserQualification: async data => {
      return await intance.post('/user/add-qualification', data);
    },
    getUserQualifications: async () => {
      return await intance.get('/user/get-qualifications');
    },
    deleteQualifications: async (scheduleId: string) => {
      return await intance.delete(`/user/delete-qualification/${scheduleId}`);
    },
    updateQualifications: async (data, qualificationId) => {
      return await intance.post(`user/edit-qualification`, data);
    },
    createUserCertification: async (data: FormData) => {
      return await intance.post('/user/add-certificate', data);
    },
    getUserCertifications: async () => {
      return await intance.get('/user/get-certificates');
    },
    updateCertifications: async (data, certificationId) => {
      return await intance.post(`/user/edit-certificate`, data);
    },
    deleteCertification: async (certificationId: string) => {
      return await intance.delete(`/user/delete-certificate/${certificationId}`);
    },
  };
};

export const UpgradeAPI = (token: string) => {
  const instance = Axios.create({
    baseURL: config.API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    uploadProfilePhotoDocument: async (data, headers) => {
      return await instance.post('/become-professional/upload-document', data, headers);
    },
    createProfessionalInformation: async (professionalInformation: ProfessionalInformationType) => {
      return await instance.post('become-professional/professional-information', {
        professional_field: professionalInformation.occupation,
        experience_year: professionalInformation.yearsOfExperience,
        linkedin_profile_url: professionalInformation.linkedInProfile,
        professional_description: professionalInformation.professionalDescription,
      });
    },
    createVerifyIdentityInformation: async (data: VerifyIdentityType) => {
      const form = new FormData();
      form.append('city', data.city);
      form.append('profile_photo', data.profilePhoto);
      form.append('resident_country', data.country);
      form.append('postal_code', data.zipCode);
      form.append('house_number', data.houseNumber);
      form.append('language', data.language);
      form.append('date_of_birth', data.dateOfBirth);
      form.append('street', data.street);
      form.append('phone_number', data.phoneNumber);
      return await instance.post('become-professional/verify-identity', form);
    },
    updatePaymentInformation: async data => {
      return await instance.post('become-professional/update-payment-information', data);
    },
    uploadVerificationDocuments: async (data: IdentityVerificationType) => {
      return await instance.post('become-professional/upload-verification-documents', {
        identity_document: data.identityDocument,
        utility_bill: data.utilityDocument,
      });
    },
    getIpAddress: async () => {
      return await instance
        .get('get-ip-address')
        .then(response => {
          return response.data.ip_address;
        })
        .catch(error => {
          throw error;
        });
    },
    createPaymentSetup: async (data: PaymentSetupType & { ipAddress: string }) => {
      // TODO: Finish this
      const transformedData = {
        preferred_payment_method: data.withdrawalMethod,
        rate_per_hour: data.ratePerHour,
        ip_address: data.ipAddress,
      };
      return await instance.post(
        '/become-professional/update-payment-information',
        transformedData
      );
    },
  };
}; */