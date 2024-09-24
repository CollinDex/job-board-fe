import React from 'react';

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>

        {/* Loading message */}
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch your data</p>
      </div>
    </div>
  );
};

export default LoadingPage;
