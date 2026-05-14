import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.name;

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          📱 SmartQueue
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          {user && (
            <>
              <NavLink to="/queue">File d&apos;attente</NavLink>
              {(role === 'USER' || role === 'ADMIN') && (
                <NavLink to="/appointments">Rendez-vous</NavLink>
              )}
              <NavLink to="/notifications">Notifications</NavLink>
              <NavLink to="/services">Services</NavLink>
              {(role === 'ADMIN' || role === 'AGENT') && (
                <NavLink to="/agent">Guichet</NavLink>
              )}
              {role === 'ADMIN' && (
                <>
                  <NavLink to="/users">Usagers</NavLink>
                  <NavLink to="/admin">Admin</NavLink>
                </>
              )}
            </>
          )}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <button
                type="button"
                className="user-pill"
                onClick={handleProfileClick}
                title="Cliquez pour voir votre profil"
              >
                <span className="user-name">{user.firstName} {user.lastName}</span>
                <small className="user-role">{role}</small>
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-secondary btn-sm" to="/login">
                Connexion
              </Link>
              <Link className="btn btn-primary btn-sm" to="/register">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
