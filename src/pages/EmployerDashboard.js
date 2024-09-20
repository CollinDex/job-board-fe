import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getEmployerJobs, deleteJob, createJob } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';

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
  const [currentJob, setCurrentJob] = useState(null);
  const [profileEdit, setProfileEdit] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchEmployerJobs();
    fetchApplications();
  }, []);

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

  const handleEditProfile = async (profileData) => {
    // Implement profile update logic here
    setProfileEdit(false);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      
      {/* User Profile Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
        {profileEdit ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditProfile({
              name: e.currentTarget.name.value,
              email: e.currentTarget.email.value,
              company: e.currentTarget.company.value,
            });
          }}>
            <Input name="name" defaultValue={user.name} label="Name" className="mb-4" />
            <Input name="email" defaultValue={user.email} label="Email" className="mb-4" />
            <Input name="company" defaultValue={user.company} label="Company" className="mb-4" />
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" className="ml-2" onClick={() => setProfileEdit(false)}>Cancel</Button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Company:</strong> {user.company}</p>
            <Button onClick={() => setProfileEdit(true)} className="mt-4">Edit Profile</Button>
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
      </section> */}

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
    </div>
  );
}






/* import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getEmployerJobs, deleteJob, createJob } from '../services/api';
import JobPostForm from '../components/JobPostForm';

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

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    setLoading(true);
    try {
      //const response = await getEmployerJobs();
      //setJobs(response.data);
      setJobs(dummyJobs);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (jobData) => {
    try {
      await createJob(jobData);
      fetchEmployerJobs();
    } catch (err) {
      setError('Failed to post job');
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Employer Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Post a New Job</h3>
        <JobPostForm onSubmit={handlePostJob} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Job Listings</h3>
        {jobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h4 className="text-xl font-bold">{job.title}</h4>
            <p className="text-gray-600">{job.company}</p>
            <p className="text-gray-600">{job.location}</p>
            <button
              onClick={() => handleDeleteJob(job.id)}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard; */