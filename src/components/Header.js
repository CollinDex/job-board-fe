// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">JobBoard</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
            <Link to="/search" className="text-gray-800 hover:text-blue-500">Jobs</Link>
            <Link to="/auth" className="text-gray-800 hover:text-blue-500">Login</Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Home</Link>
            <Link to="/search" className="block py-2 px-4 text-sm hover:bg-gray-200">Jobs</Link>
            <Link to="/auth" className="block py-2 px-4 text-sm hover:bg-gray-200">Login</Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;