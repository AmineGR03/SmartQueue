import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Tableau de bord</h1>
      <p className="muted">
        Bienvenue, {user?.firstName} {user?.lastName} ({user?.email})
      </p>
      <div className="grid-cards">
        <Link className="card highlight" to="/queue">
          <h3>File d&apos;attente</h3>
          <p>Obtenir un ticket pour un service</p>
        </Link>
        <Link className="card highlight" to="/appointments">
          <h3>Rendez-vous</h3>
          <p>Gérer vos rendez-vous</p>
        </Link>
        <Link className="card highlight" to="/notifications">
          <h3>Notifications</h3>
          <p>Voir vos alertes</p>
        </Link>
        {(user?.role?.name === 'ADMIN' || user?.role?.name === 'AGENT') && (
          <Link className="card highlight" to="/agent">
            <h3>Guichet</h3>
            <p>Appeler et clôturer des tickets</p>
          </Link>
        )}
      </div>
    </div>
  );
}
