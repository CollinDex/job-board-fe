// src/pages/JobDetails.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJobDetails, applyForJob } from '../services/api';
import { useSelector } from 'react-redux';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const jobs = useSelector((state) => state.jobs?.postedJobs);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails(id);
  }, [id]);


  const fetchJobDetails = (id) => {
    try {
      const job = jobs.filter((job) => job._id === id);
      setJob(...job);
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
      <h1 className="text-3xl font-bold mb-6 text-center">Job Details</h1>
      <div className="border border-gray-200 p-4">
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
      </div>
      <div className='flex space-x-4'>
        <button
          onClick={handleApply}
          className="bg-blue-500 mt-2 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Now
        </button>
        <Link to={'/jobs'}>
          <button className="bg-red-500 mt-2 text-white px-4 py-2 rounded hover:bg-blue-600">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}

export default JobDetails;