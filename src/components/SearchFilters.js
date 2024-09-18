import React, { useState } from 'react';

function SearchFilters({ onFilter }) {
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ jobType, location, salaryRange });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="w-full md:w-1/3 px-2">
          <select
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Salary Ranges</option>
            <option value="0-50000">$0 - $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000+">$100,000+</option>
          </select>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Apply Filters
      </button>
    </form>
  );
}

export default SearchFilters;