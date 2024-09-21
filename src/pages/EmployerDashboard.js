import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEmployerJobs, deleteJob, createJob, getProfile, updateProfile, deleteProfile } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { setProfile } from '../store/profileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const dummyJobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    salary: "120,000",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Creative Solutions",
    location: "New York, NY",
    salary: "110,000",
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DataCorp",
    location: "Remote",
    salary: "95,000",
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "Design Studio",
    location: "Los Angeles, CA",
    salary: "105,000",
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "Cloud Tech Ltd.",
    location: "Austin, TX",
    salary: "115,000",
  },
  {
    id: 6,
    title: "Project Manager",
    company: "Project Hub",
    location: "Seattle, WA",
    salary: "130,000",
  },
];

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile?.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchEmployerJobs();
    fetchApplications();
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

  const fetchEmployerJobs = async () => {
    setLoading(true);
    try {
      //const response = await getEmployerJobs();
      setJobs(dummyJobs);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      //const response = await getApplications();
      setApplications([]);
    } catch (err) {
      setError('Failed to fetch applications');
    }
  };

  const handleJobSubmit = async (jobData) => {
    try {
      if (currentJob) {
        //await updateJob(currentJob.id, jobData);
      } else {
        await createJob(jobData);
      }
      fetchEmployerJobs();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      fetchEmployerJobs();
    } catch (err) {
      setError('Failed to delete job');
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
            <Input
              name="profile_company"
              defaultValue={profile.profile_company}
              label="Company"
              className="mb-4"
            />
            <Input
              name="profile_position"
              defaultValue={profile.profile_position}
              label="Position"
              className="mb-4"
            />
            <Input
              name="profile_company_address"
              defaultValue={profile.profile_company_address}
              label="Company Address"
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
              <p className="text-sm font-semibold text-gray-600">Address:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_address}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Company:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_company}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Position:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_position}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Company Address:</p>
              <p className="text-base font-normal text-gray-900">{profile?.profile_company_address}</p>
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


      {/* Job Listings Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Job Listings</h2>
        <Button onClick={() => {
          setCurrentJob(null);
          setIsModalOpen(true);
        }} className="mb-4">Post New Job</Button>
        {jobs.map((job) => (
          <div key={job.id} className="border-b border-gray-200 py-4 last:border-b-0">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <p className="text-gray-600">${job.salary}</p>
            <div className="mt-2">
              <Button variant="outline" onClick={() => {
                setCurrentJob(job);
                setIsModalOpen(true);
              }} className="mr-2">Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteJob(job.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </section>

      {/* Applications Section */}
      
      {/* <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Applications</h2>
        {applications.map((application) => (
          <div key={application.id} className="border-b border-gray-200 py-4 last:border-b-0">
            <h3 className="text-xl font-bold">{application.job.title}</h3>
            <p><strong>Applicant:</strong> {application.applicant.name}</p>
            <p><strong>Email:</strong> {application.applicant.email}</p>
            <p><strong>Status:</strong> {application.status}</p>
          </div>
        ))}
      </section> 
      */}

      {/* Job Post/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{currentJob ? 'Edit Job' : 'Post New Job'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleJobSubmit({
            title: e.currentTarget.title.value,
            company: e.currentTarget.company.value,
            location: e.currentTarget.location.value,
            salary: parseInt(e.currentTarget.salary.value),
            description: e.currentTarget.description.value,
          });
        }}>
          <Input name="title" defaultValue={currentJob?.title} label="Job Title" className="mb-4" />
          <Input name="company" defaultValue={currentJob?.company} label="Company" className="mb-4" />
          <Input name="location" defaultValue={currentJob?.location} label="Location" className="mb-4" />
          <Input name="salary" defaultValue={currentJob?.salary} label="Salary" type="number" className="mb-4" />
          <TextArea name="description" defaultValue={currentJob?.description} label="Job Description" className="mb-4" />
          <Button type="submit">{currentJob ? 'Update Job' : 'Post Job'}</Button>
        </form>
      </Modal>

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
      
    </div>
  );
}