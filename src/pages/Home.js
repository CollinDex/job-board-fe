import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function Home() {
  const userRole = useSelector((state) => state.auth.user?.role); // User role from Redux store
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  let dashboard;

  if (isAuthenticated && userRole === "employer") {
    dashboard = '/employer-dashboard';
  } else if (isAuthenticated && userRole === "job_seeker") {
    dashboard = '/jobseeker-dashboard';
  } else {
    dashboard = '/auth'; // Redirect to profile if profile is incomplete or missing
  }
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Find Your Dream Job
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Search thousands of job listings from top companies. Your next career move starts here.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <input
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search jobs..."
                type="text"
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                type="submit"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>
            </form>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/jobs">
              <button className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                <Briefcase className="h-5 w-5 inline-block mr-2" />
                Browse Jobs
              </button>
            </Link>
            <Link to={dashboard}>
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors">
                Post a Job
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}