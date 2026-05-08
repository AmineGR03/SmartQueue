import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="page hero">
      <h1>Gestion intelligente des files d&apos;attente</h1>
      <p className="lead">
        Prenez un ticket, réservez un rendez-vous et suivez votre file en temps réel.
      </p>
      {!user ? (
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/register">
            Créer un compte
          </Link>
          <Link className="btn btn-secondary" to="/login">
            Se connecter
          </Link>
        </div>
      ) : (
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/queue">
            Prendre un ticket
          </Link>
          <Link className="btn btn-secondary" to="/dashboard">
            Mon espace
          </Link>
        </div>
      )}
    </div>
  );
}
