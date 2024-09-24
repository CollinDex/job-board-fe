import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
      {/* Error icon */}
      <div className="mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2v6m-6-6h12m-6 6a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
      </div>

      {/* Error message */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
      <p className="text-gray-500 mb-4">
        We couldn’t find the page you were looking for.
      </p>

      {/* Navigation button */}
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Go back home
      </Link>
    </div>
  );
};

export default ErrorPage;
