import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getJobApplications, updateApplicationStatus } from '../services/api';
import LoadingPage from '../components/ui/Loading';
import ErrorPage from '../components/ui/Error';
import { Button } from '../components/ui/Button';  // Button Component for actions
import { Modal } from '../components/ui/Modal'; // Assuming you already have a Modal component
import { toast } from 'react-toastify';

function Applications() {
  const { id } = useParams(); // Job ID from the route params
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); // Track which application is being updated
  const [newStatus, setNewStatus] = useState(''); // Track the new status selected by the employer

  useEffect(() => {
    fetchApplications(id);
  }, [id]);

  useEffect (() => {
    window.scrollTo(0,0);
  }, []);

  const fetchApplications = async (jobId) => {
    try {
      const res = await getJobApplications(jobId);
      setTitle(res.data.applications[0]?.title);
      setApplications(res.data.applications[0]?.applications || []);
    } catch (err) {
      setError('Failed to fetch job applications');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleStatusChange = async () => {
    const toastId = toast.loading('Updating Application');
    try {
      await updateApplicationStatus(selectedApplication._id, newStatus );
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === selectedApplication._id ? { ...app, status: newStatus } : app
        )
      );
      toast.update(toastId, {
        render: 'Set Status Succesful',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      setIsModalOpen(false); // Close modal after successful update
    } catch (error) {
        toast.update(toastId, {
            render: 'Set Status Failed',
            type: 'error',
            isLoading: false,
            autoClose: 3000,
          });
      console.error('Failed to update status', error);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;
  if (applications.length === 0) return <div>No applications found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">{title} Applications</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((application) => (
          <div
            key={application._id}
            className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-lg"
          >
            <p className="text-gray-600 mb-2">
              <strong>Name:</strong> {application?.applicant_name}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Cover Letter:</strong> {application.cover_letter}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Resume:</strong> 
              <a 
                href={application.resume} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                View Resume
              </a>
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Status:</strong> {application.status}
            </p>

            <p className="text-gray-600 text-sm">
              <strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}
            </p>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="border-2 border-blue-500 text-blue-500 py-2 px-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out"
                onClick={() => handleOpenModal(application)} // Open modal to change status
              >
                Change Status
              </Button>
              
              <Link to={'/employer-dashboard'}>
                <Button
                    variant="destructive"
                    className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out">
                    Back
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Changing Status */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Change Application Status</h2>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Select New Status
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a status</option>
            <option value="hired">Hired</option>
            <option value="reviewed">Reviewed</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-300 ease-in-out"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out"
            onClick={handleStatusChange}
          >
            Update Status
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Applications;
