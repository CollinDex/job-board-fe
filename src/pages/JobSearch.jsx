// src/pages/JobSearch.js
import React, { useState, useEffect } from 'react';
import { searchJobs } from '../services/api';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyword, setPostedJobs } from '../store/jobsSlice';
import LoadingPage from '../components/ui/Loading';

function JobSearch() {
  const [loading, setLoading] = useState(false);
  const keyword = useSelector((state) => state.jobs?.keyword);
  const jobs = useSelector((state) => state.jobs?.postedJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchJobs(keyword);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect (() => {
    window.scrollTo(0,0);
  }, []);

  const fetchJobs = async (params) => {
    setLoading(true);
    try {
      const response = await searchJobs(params);
      dispatch(setPostedJobs(response.data.jobs));
      dispatch(setKeyword({}));
    } catch (err) {
      toast.error("No jobs applications at the moment");
      dispatch(setPostedJobs([]));
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (newFilters) => {
    const toastId = toast.loading('Searching jobs...');
    try {
      const response = await searchJobs(newFilters);
      dispatch(setPostedJobs(response.data.jobs));
      toast.update(toastId, {
        render: 'Matching Jobs found',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: 'Matching Job not Found',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
      dispatch(setPostedJobs([]));
    } 
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-center ">Job Listings</h1>
      <SearchFilters onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobSearch;
