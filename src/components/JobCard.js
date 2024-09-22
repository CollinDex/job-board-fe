import React from 'react';
import { Link } from 'react-router-dom';

function JobCard({ job }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">{job.title}</h2>
        <p className="text-gray-600 mb-2">{job.company}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <p className="text-gray-600 mb-2 sm:mb-0">{job.location}</p>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <p className="text-green-600 font-semibold">
              Min: ${job.min_salary}
            </p>
            <p className="text-red-600 font-semibold">
              Max: ${job.max_salary}
            </p>
          </div>
        </div>
        <Link
          to={`/job/${job._id}`}
          className="block mt-4 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition-all duration-300 ease-in-out"
        >
          View Details
        </Link>
      </div>
    );
}  

export default JobCard;