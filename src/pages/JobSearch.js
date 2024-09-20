// src/pages/JobSearch.js
import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';

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

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const fetchJobs = async (params) => {
    setLoading(true);
    try {
      //const response = await getJobs(params);
      //setJobs(response.data);
      setJobs(dummyJobs);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-center ">Job Listings</h1>
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