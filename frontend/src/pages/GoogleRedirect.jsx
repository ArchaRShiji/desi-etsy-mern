import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const GoogleRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const complete = params.get('complete') === 'true';

    if (token) {
      localStorage.setItem('token', token);
      if (complete) {
        navigate('/');
      } else {
        navigate('/complete-profile');
      }
    }
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleRedirect;