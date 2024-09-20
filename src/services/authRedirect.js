import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Replace with your auth state logic
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth'); // Redirect to home page if not authenticated
    }
  }, [isAuthenticated, navigate]);
};

export default useAuthRedirect;
