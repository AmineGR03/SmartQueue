import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar Component
 * Alternative navigation sidebar with role-based menu items
 */
export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const isAdmin = user.role?.name === 'ADMIN';
  const isAgent = user.role?.name === 'AGENT';
  const isUser = user.role?.name === 'USER';

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        className="sidebar-toggle mobile-only"
        onClick={toggleSidebar}
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      {/* Sidebar */}
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
          {/* Common links for all authenticated users */}
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
          </div>

          {/* User specific links */}
          {isUser && (
            <div className="sidebar__section">
              <p className="sidebar__label">Usager</p>
              <Link
                to="/tickets"
                className={`sidebar__link ${isActive('/tickets') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Mes tickets
              </Link>
              <Link
                to="/appointments"
                className={`sidebar__link ${isActive('/appointments') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Mes rendez-vous
              </Link>
            </div>
          )}

          {/* Agent specific links */}
          {isAgent && (
            <div className="sidebar__section">
              <p className="sidebar__label">Agent</p>
              <Link
                to="/agent"
                className={`sidebar__link ${isActive('/agent') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Guichet
              </Link>
              <Link
                to="/queue"
                className={`sidebar__link ${isActive('/queue') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                File d'attente
              </Link>
            </div>
          )}

          {/* Admin specific links */}
          {isAdmin && (
            <div className="sidebar__section">
              <p className="sidebar__label">Administration</p>
              <Link
                to="/admin"
                className={`sidebar__link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Santé du système
              </Link>
              <Link
                to="/services"
                className={`sidebar__link ${isActive('/services') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/users"
                className={`sidebar__link ${isActive('/users') ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                Usagers
              </Link>
            </div>
          )}

          {/* Common links */}
          <div className="sidebar__section">
            <p className="sidebar__label">Notifications</p>
            <Link
              to="/notifications"
              className={`sidebar__link ${isActive('/notifications') ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              Notifications
            </Link>
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <p>
              <strong>{user.firstName} {user.lastName}</strong>
            </p>
            <p className="muted">{user.email}</p>
            <p className="badge badge-sm">{user.role?.name}</p>
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay mobile-only" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
