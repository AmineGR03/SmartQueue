import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation latérale selon le rôle (USER / AGENT / ADMIN).
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const role = user.role?.name;
  const isAdmin = role === 'ADMIN';
  const isAgent = role === 'AGENT';
  const isUser = role === 'USER';

  const isActive = (path) => location.pathname === path;
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle mobile-only"
        onClick={toggleSidebar}
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar__header">
          <h2>Menu</h2>
          <button
            type="button"
            className="sidebar-close mobile-only"
            onClick={toggleSidebar}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <p className="sidebar__label">Navigation</p>
            <Link
              to="/"
              className={`sidebar__link ${isActive('/') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className={`sidebar__link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Tableau de bord
            </Link>
            <Link
              to="/queue"
              className={`sidebar__link ${isActive('/queue') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              File d&apos;attente
            </Link>
            <Link
              to="/services"
              className={`sidebar__link ${isActive('/services') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/notifications"
              className={`sidebar__link ${isActive('/notifications') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Notifications
            </Link>
          </div>

          {(isUser || isAdmin) && (
            <div className="sidebar__section">
              <p className="sidebar__label">Rendez-vous</p>
              <Link
                to="/appointments"
                className={`sidebar__link ${isActive('/appointments') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                {isAdmin ? 'Rendez-vous (tous)' : 'Mes rendez-vous'}
              </Link>
            </div>
          )}

          {(isAgent || isAdmin) && (
            <div className="sidebar__section">
              <p className="sidebar__label">Guichet</p>
              <Link
                to="/agent"
                className={`sidebar__link ${isActive('/agent') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Tickets & confirmations
              </Link>
            </div>
          )}

          {isAdmin && (
            <div className="sidebar__section">
              <p className="sidebar__label">Administration</p>
              <Link
                to="/users"
                className={`sidebar__link ${isActive('/users') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Usagers
              </Link>
              <Link
                to="/admin"
                className={`sidebar__link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Santé du système
              </Link>
            </div>
          )}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <p>
              <strong>
                {user.firstName} {user.lastName}
              </strong>
            </p>
            <p className="muted">{user.email}</p>
            <p className="badge badge-sm">{role}</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {isOpen && (
        <div className="sidebar-overlay mobile-only" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
