import React, { useEffect, useState } from 'react';
import * as adminService from '../services/adminService';

export default function AdminPage() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminService.adminHealth();
        if (!cancelled) setHealth(data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.message || e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <h1>Administration</h1>
      <p className="muted">Route réservée au rôle ADMIN.</p>
      {error && <div className="alert alert-error">{error}</div>}
      {health && (
        <div className="card">
          <h3>État admin</h3>
          <pre className="json-preview">{JSON.stringify(health, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
