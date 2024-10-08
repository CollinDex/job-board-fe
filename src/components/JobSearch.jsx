import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';
import LoadingPage from './ui/Loading';
import ErrorPage from './ui/Error';

function JobSearch() {
  //const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const fetchJobs = async (params) => {
    setLoading(true);
    try {
      const response = await getJobs(params);
      //setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <LoadingPage/>;
  if (error) return <ErrorPage/>;

  const jobs = [];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Job Listings</h1>
      <SearchFilters onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobSearch;