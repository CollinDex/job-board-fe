import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getEmployerJobs, deleteJob, createJob } from '../services/api';
import JobPostForm from '../components/JobPostForm';

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
      const response = await getEmployerJobs();
      setJobs(response.data);
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

export default EmployerDashboard;