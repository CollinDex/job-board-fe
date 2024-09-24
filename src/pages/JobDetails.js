import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJobDetails, applyForJob } from '../services/api';
import { useSelector } from 'react-redux';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';  // assuming Button is already a component
import { Input } from '../components/ui/Input';    // assuming Input is already a component
import { TextArea } from '../components/ui/TextArea';
import { toast } from 'react-toastify';
import LoadingPage from '../components/ui/Loading';
import ErrorPage from '../components/ui/Error';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useExistingResume, setUseExistingResume] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  
  const jobs = useSelector((state) => state.jobs?.postedJobs);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const userRole = useSelector((state) => state.auth.user?.role);

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

  const handleApply = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('job_id', job._id);
    formData.append('cover_letter', coverLetter);
    if (useExistingResume) {
      formData.append('use_existing_resume', true);
    } else {
      formData.append('resume', selectedResume);
    }

    const toastId = toast.loading('Processing job application');

    try {
      await applyForJob(formData);
      toast.update(toastId, {
        render: 'Application submitted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setIsModalOpen(false);
    } catch (err) {
      toast.update(toastId, {
        render: `Failed to submit application: ${err.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleResumeUpload = (e) => {
    setSelectedResume(e.target.files[0]);
  };

  if (loading) return <LoadingPage/>;
  if (error) return <ErrorPage/>;
  if (!job) return <ErrorPage/>

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
      { 
        isAuthenticated && userRole === "job_seeker" ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 mt-2 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Now
          </button>
        ) : isAuthenticated && userRole === "employer" ? (
          <button
            disabled
            className="bg-gray-300 mt-2 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
          >
            Only Job Seekers Can Apply for Jobs
          </button>
        ) : (
          <Link
            to="/auth"
            className="bg-blue-500 mt-2 text-white px-4 py-2 rounded text-center hover:bg-red-600"
          >
            Sign in to Apply
          </Link>
        )
      }
        <Link to={'/jobs'}>
          <button className="bg-red-500 mt-2 text-white px-4 py-2 rounded hover:bg-red-600">
            Back
          </button>
        </Link>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
        <form onSubmit={handleApply}>
          <TextArea
            name="cover_letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            label="Cover Letter"
            className="mb-4"
          />
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-600 mb-2 block">
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              disabled={useExistingResume}
              onChange={handleResumeUpload}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={useExistingResume}
              onChange={() => setUseExistingResume(!useExistingResume)}
              className="mr-2"
            />
            <label className="text-gray-600">Use existing resume</label>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default JobDetails;



/* 
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

export default JobDetails; */