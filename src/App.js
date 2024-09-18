// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Auth from './pages/Auth';

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<JobSearch />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route 
              path="/employer-dashboard" 
              element={
                <PrivateRoute>
                  <EmployerDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/jobseeker-dashboard" 
              element={
                <PrivateRoute>
                  <JobSeekerDashboard />
                </PrivateRoute>
              } 
            />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;