// src/components/Header.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRole = user?.role;


  const handleLogout = () => {
    try {
      // Remove the token from local storage
      localStorage.removeItem('token');
  
      // Optionally, clear any user-specific state from your app (like Redux)
      dispatch(logout());
  
      // Redirect the user to the login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
  

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src="./favicon.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">JobBoard</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
            {userRole && (
              <Link 
                to={userRole === "employer" ? "/employer-dashboard" : "/jobseeker-dashboard"} 
                className="text-gray-800 hover:text-blue-500"
              >
                Dashboard
              </Link>
            )}
            <Link to="/jobs" className="text-gray-800 hover:text-blue-500">Jobs</Link>
            { isAuthenticated ?
              <Link to="/auth" onClick={handleLogout} className="text-gray-800 hover:text-blue-500">Logout</Link>
              :
              <Link to="/auth" className="text-gray-800 hover:text-blue-500">Login</Link>
            }              
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
            {userRole && (
              <Link 
                to={userRole === "employer" ? "/employer-dashboard" : "/jobseeker-dashboard"} 
                className="block py-2 px-4 text-sm hover:bg-gray-200"
              >
                Dashboard
              </Link>
            )}
            <Link to="/jobs" className="block py-2 px-4 text-sm hover:bg-gray-200">Jobs</Link>
            { isAuthenticated ?
              <Link to="/auth" onClick={handleLogout} className="block py-2 px-4 text-sm hover:bg-gray-200">Logout</Link>
              :
              <Link to="/auth" className="block py-2 px-4 text-sm hover:bg-gray-200">Login</Link>}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;