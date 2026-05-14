import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const role = user?.role?.name;

  return (
    <header className="navbar">
      <div>
        <Link to="/" className="brand">
          📱 SmartQueue
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Tableau de bord</NavLink>
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
              <span className="user-pill">
                <span>{user.firstName} {user.lastName}</span>
                <small>{role}</small>
              </span>
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
