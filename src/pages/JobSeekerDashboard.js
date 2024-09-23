import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setProfile } from '../store/profileSlice';
import { deleteProfile, getAppliedJobs, getProfile, updateProfile, uploadResume } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { setAppliedJobs } from '../store/jobsSlice';


// Helper function to style the status
const getStatusClass = (status) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800";
    case "hired":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "interview":
      return "bg-purple-100 text-purple-800";
    case "reviewed":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function JobSeekerDashboard() {
  //const [applications, setApplications] = useState(dummyApplications); // Use the dummy data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile?.profile);
  const appliedJobs = useSelector((state) => state.jobs?.appliedJobs);

  useEffect(() => {
    fetchDashboardData();
    fetchApplications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      dispatch(setProfile(res.data?.profile));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let profileData = {};
  
    try {
      // Filter out empty fields
      const fields = [
        'profile_name', 
        'profile_phone', 
        'profile_address', 
        'profile_company', 
        'profile_position', 
        'profile_company_address'
      ];
  
      fields.forEach((field) => {
        const value = formData.get(field);
        if (value && value.trim() !== '') {
          profileData[field] = value;
        }
      });
  
      const profile = await updateProfile(profileData);
      dispatch(setProfile(profile.data.profile));
      toast.success("User Profile Updated Successfully");
      setProfileEdit(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      toast.error("Failed to update Profile");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteProfile();
      toast.success("Profile deleted successfully");
      navigate(0);
    } catch (err) {
      toast.error("Failed to delete profile");
    }
  };

  const handleResumeUpload = async (event) => {
    event.preventDefault();
    try {
      // Start the loading toast before upload
      const toastId = toast.loading('Uploading resume...');
  
      // Upload the resume and get the updated profile in response
      const res = await uploadResume(selectedResume);
  
      // Dispatch the updated profile to the Redux store
      dispatch(setProfile(res.data?.profile));
  
      // Update the loading toast with a success message
      toast.update(toastId, {
        render: 'Resume uploaded successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
  
      // Close the modal after successful upload
      setIsUploadModalOpen(false);
    } catch (error) {
      // Display an error message if the upload fails
      toast.error('Failed to upload resume');
    }
  };  

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAppliedJobs();
      console.log(res.data?.applications);
      dispatch(setAppliedJobs(res.data?.applications));
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4 text-center">Welcome, {user.username}</h2>

      {/* User Profile Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Profile</h2>
        {profileEdit ? (
          <form onSubmit={handleEditProfile}>
            <Input
              name="profile_name"
              defaultValue={profile.profile_name}
              label="Name"
              className="mb-4"
            />
            <Input
              name="profile_phone"
              defaultValue={profile.profile_phone}
              label="Phone"
              className="mb-4"
            />
            <Input
              name="profile_address"
              defaultValue={profile.profile_address}
              label="Address"
              className="mb-4"
            />
            <div className="flex justify-between space-x-4">
              <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-gray-100 text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-200"
                onClick={() => setProfileEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-gray-700">
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Name:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Phone:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_phone}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Email:</p>
              <p className="text-base font-normal text-gray-900">{user?.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Address:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_address}</p>
            </div>
            <div className="mb-4 flex items-center">
              <p className="text-sm font-semibold text-gray-600">Resume:</p>
              <a href={profile?.profile_resume} target="_blank" rel="noopener noreferrer"
                className="text-base font-normal text-blue-500 hover:underline ml-2">
                View Resume
              </a>
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-green-500 text-white py-1 px-2 ml-1 rounded-md hover:bg-green-600"
                style={{ padding: '4px 8px', fontSize: '12px' }}>
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setProfileEdit(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Edit Profile
              </Button>
              <Button
                onClick={() => setIsDeleteProfileModalOpen(true)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Delete Profile
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* JoB Application Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Your Applications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appliedJobs.map((application) => (
            <div
              key={application.job._id}
              className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">{application.job.title}</h4>
              <p className="text-gray-600 mb-2">{application.job.company}</p>
              <p className="text-gray-500 mb-2">Location: {application.job.location}</p>
              <p className="text-gray-500 mb-2">Salary: ${application.job.min_salary} - {application.job.min_salary}</p>
              <p className="text-gray-500 mb-2">Salary: ${application.job.job_type}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                  application.application_status
                )}`}
              >
                Status: {application.application_status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Delete confirmation */}
      <Modal isOpen={isDeleteProfileModalOpen} onClose={() => setIsDeleteProfileModalOpen(false)} title="Delete Profile">
        <p className="text-gray-600">
          Are you sure you want to delete your profile? This action cannot be undone.
        </p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            onClick={() => setIsDeleteProfileModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 ml-2 rounded-md hover:bg-red-600"
            onClick={handleDeleteProfile} // Call delete profile handler
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Modal for uploading resume */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Resume">
        <form onSubmit={handleResumeUpload}>
          <Input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setSelectedResume(e.target.files[0])}
            required
            label="Select Resume"
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Upload
            </Button>
            <Button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="ml-2 bg-red-500 text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default JobSeekerDashboard;
