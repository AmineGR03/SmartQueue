import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Logged-in user goes to dashboard
      navigate('/dashboard');
    } else {
      // Non-logged-in user goes to public queue
      navigate('/public-queue');
    }
  }, [user, navigate]);

  return null;
}
