import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getJobSeekerApplications } from '../services/api';

function JobSeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getJobSeekerApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Job Seeker Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Applications</h3>
        {applications.map((application) => (
          <div key={application.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h4 className="text-xl font-bold">{application.job.title}</h4>
            <p className="text-gray-600">{application.job.company}</p>
            <p className="text-gray-600">Status: {application.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobSeekerDashboard;