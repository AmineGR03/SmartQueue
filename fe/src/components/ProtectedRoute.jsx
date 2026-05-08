import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * roles: liste optionnelle des noms de rôle autorisés (ex: ['ADMIN', 'AGENT'])
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-shell">
        <div className="spinner" />
        <p>Chargement…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length) {
    const roleName = user.role?.name;
    if (!roles.includes(roleName)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
