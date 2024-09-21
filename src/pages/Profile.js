import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import useAuthRedirect from '../services/authRedirect';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployerProfile, createJobSeekerProfile } from '../services/api';
import { setProfile } from '../store/profileSlice';
import { toast } from 'react-toastify';

export default function CreateProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user.role); // User role from Redux store

  useAuthRedirect(); //For protected Routes

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let profileData = {};

    try {
        if (userRole === 'employer') {
            profileData = {
              profile_name: formData.get('profile_name'),
              profile_phone: formData.get('profile_phone'),
              profile_address: formData.get('profile_address'),
              profile_company: formData.get('profile_company'),
              profile_position: formData.get('profile_position'),
              profile_company_address: formData.get('profile_company_address'),
            };
            const profile = await createEmployerProfile(profileData);
            dispatch(setProfile(profile.data.profile));
          } else if (userRole === 'job_seeker') {
            profileData = {
              profile_name: formData.get('profile_name'),
              profile_phone: formData.get('profile_phone'),
              profile_address: formData.get('profile_address'),
            };
            const profile = await createJobSeekerProfile(profileData);
            dispatch(setProfile(profile.data.profile));
          }
          toast.success("User Profile Created Succesfully");
      setIsModalOpen(true);
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      toast.error("Failed to create Profile");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Profile</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="profile_name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="profile_name" name="profile_name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div className="mb-4">
          <label htmlFor="profile_phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" id="profile_phone" name="profile_phone" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div className="mb-4">
          <label htmlFor="profile_address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" id="profile_address" name="profile_address" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>

        {userRole === 'employer' && (
          <>
            <div className="mb-4">
              <label htmlFor="profile_company" className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" id="profile_company" name="profile_company" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div className="mb-4">
              <label htmlFor="profile_position" className="block text-sm font-medium text-gray-700">Position</label>
              <input type="text" id="profile_position" name="profile_position" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
            <div className="mb-4">
              <label htmlFor="profile_company_address" className="block text-sm font-medium text-gray-700">Company Address</label>
              <input type="text" id="profile_company_address" name="profile_company_address" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
            </div>
          </>
        )}

        {/* {userRole === 'job_seeker' && (
          <div className="mb-4">
            <label htmlFor="profile_resume" className="block text-sm font-medium text-gray-700">Resume Link (Optional) </label>
            <input type="text" id="profile_resume" name="profile_resume" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          </div>
        )} */}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Create Profile
        </button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Profile Created Successfully!</h2>
        <p className="mb-4">Your profile has been created. You can now start using the job board.</p>
        <button 
          onClick={() => {
            if (userRole === 'employer') {
              navigate('/employer-dashboard');
            } else if (userRole === 'job_seeker') {
              navigate('/jobseeker-dashboard');
            }
          }}  
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Go to Dashboard
        </button>
      </Modal>
    </div>
  );
}