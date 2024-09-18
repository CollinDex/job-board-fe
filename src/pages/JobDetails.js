// src/pages/JobDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobDetails, applyForJob } from '../services/api';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await getJobDetails(id);
      setJob(response.data);
    } catch (err) {
      setError('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await applyForJob(id);
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <p className="text-xl mb-2">{job.company}</p>
      <p className="text-gray-600 mb-4">{job.location}</p>
      <p className="mb-4">{job.description}</p>
      <button
        onClick={handleApply}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Apply Now
      </button>
    </div>
  );
}

export default JobDetails;