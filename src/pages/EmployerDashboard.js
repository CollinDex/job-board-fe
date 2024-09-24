import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, updateProfile, deleteProfile, postJob, getJobs, editJob, deleteJob } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { setProfile } from '../store/profileSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { deleteJobInStore, setJobs, updateJobInStore } from '../store/jobsSlice';
import LoadingPage from '../components/ui/Loading';
import ErrorPage from '../components/ui/Error';

export default function EmployerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteProfileModalOpen, setIsDeleteProfileModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.profile?.profile);
  const jobs = useSelector((state) => state.jobs.jobs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      const jobs = await getJobs();
      dispatch(setProfile(res.data?.profile));
      dispatch(setJobs(jobs.data?.jobs));
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

  const handlePostJob = async (event) => {
    event.preventDefault();
  
    const jobData = {
      title: event.currentTarget.title.value,
      description: event.currentTarget.description.value,
      company: profile.profile_company,
      qualifications: event.currentTarget.qualifications.value.split('/').map((item) => item.trim()),
      responsibilities: event.currentTarget.responsibilities.value.split('/').map((item) => item.trim()),
      location: event.currentTarget.location.value,
      min_salary: parseInt(event.currentTarget.min_salary.value),
      max_salary: parseInt(event.currentTarget.max_salary.value),
      job_type: event.currentTarget.job_type.value,
      status: 'open',
      job_id: currentJob?._id
    };
  
    const toastId = toast.loading('Processing job...');
  
    try {
      if (currentJob) {
        // Edit job if `currentJob` exists
        const res = await editJob(jobData);
        toast.update(toastId, {
          render: 'Job updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        // Update jobs in Redux store
        dispatch(updateJobInStore(res.data?.job));
      } else {
        // Post a new job
        const res = await postJob(jobData);
        dispatch(setJobs([res.data?.job, ...jobs])); // Add new job to the jobs array
        toast.update(toastId, {
          render: 'Job posted successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      }
  
      setIsModalOpen(false);
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to ${currentJob ? "update" : "post"} job: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDeleteJob = async (job_id) => {
    const toastId = toast.loading('Processing job...');
    try {
      await deleteJob(job_id);
      toast.update(toastId, {
        render: 'Job deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(deleteJobInStore(job_id));
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to delete job",
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading) return <LoadingPage/>;
  if (error) return <ErrorPage/>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Welcome, {user.username}
      </h2>

      {/* User Profile Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          User Profile
        </h2>
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
              <Button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
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
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_name}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Phone:</p>
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_phone}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Email:</p>
              <p className="text-base font-normal text-gray-900">
                {user?.email}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Address:</p>
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_address}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Company:</p>
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_company}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">Position:</p>
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_position}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600">
                Company Address:
              </p>
              <p className="text-base font-normal text-gray-900">
                {profile?.profile_company_address}
              </p>
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
        <Button
          onClick={() => {
            setCurrentJob(null);
            setIsModalOpen(true);
          }}
          className="mb-4"
        >
          Post New Job
        </Button>

        {jobs.map((job) => (
          <div
            key={job._id}
            className="border-b border-gray-200 py-4 last:border-b-0"
          >
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <p className="text-gray-600">
              Min Salary: ${job.min_salary} - Max Salary: ${job.max_salary}
            </p>
            <p className="text-gray-600 mb-2">Job Type: {job.job_type}</p>

            <h4 className="text-lg font-semibold">Job Description</h4>
            <p className="text-gray-600 mb-2">{job.description}</p>

            <h4 className="text-lg font-semibold">Qualifications</h4>
            <ul className="list-disc ml-6 mb-2">
              {job.qualifications.map((qualification, index) => (
                <li key={index} className="text-gray-600">
                  {qualification}
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold">Responsibilities</h4>
            <ul className="list-disc ml-6 mb-2">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-gray-600">
                  {responsibility}
                </li>
              ))}
            </ul>
            <div>
            <h4 className="text-lg font-semibold">Applicants</h4>
            <p className="text-gray-600 mb-2">{job.applications?.length}</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentJob(job);
                  setIsModalOpen(true);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteJob(job._id)}
                className="bg-red-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Delete
              </Button>
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
        <h2 className="text-2xl font-bold mb-4">
          {currentJob ? "Edit Job" : "Post New Job"}
        </h2>
        <form
          onSubmit={(e) => handlePostJob(e)}
        >
          <Input
            name="title"
            defaultValue={currentJob?.title}
            label="Job Title"
            className="mb-4"
          />
          <TextArea
            name="description"
            defaultValue={currentJob?.description}
            label="Job Description"
            className="mb-4"
          />
          <TextArea
            name="qualifications"
            defaultValue={currentJob?.qualifications?.join(", ")}
            label="Qualifications (backslash-separated)"
            className="mb-4"
          />
          <TextArea
            name="responsibilities"
            defaultValue={currentJob?.responsibilities?.join(", ")}
            label="Responsibilities (backslash-separated)"
            className="mb-4"
          />
          <Input
            name="location"
            defaultValue={currentJob?.location}
            label="Location"
            className="mb-4"
          />
          <div className="flex space-x-4">
            <Input
              name="min_salary"
              defaultValue={currentJob?.min_salary}
              label="Minimum Salary"
              type="number"
              className="mb-4"
            />
            <Input
              name="max_salary"
              defaultValue={currentJob?.max_salary}
              label="Maximum Salary"
              type="number"
              className="mb-4"
            />
          </div>
          <Input
            name="job_type"
            defaultValue={currentJob?.job_type}
            label="Job Type (e.g. full-time, part-time, contract)"
            className="mb-4"
          />
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 transition duration-300 ease-in-out">
              {currentJob ? "Update Job" : "Post Job"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal for Delete confirmation */}
      <Modal
        isOpen={isDeleteProfileModalOpen}
        onClose={() => setIsDeleteProfileModalOpen(false)}
        title="Delete Profile"
      >
        <p className="text-gray-600">
          Are you sure you want to delete your profile? This action cannot be
          undone.
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