import React, { useCallback, useEffect, useState } from 'react';
import * as userService from '../services/userService';

/**
 * UsersPage - Admin page for managing users
 */
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, ADMIN, AGENT, USER

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des usagers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet usager?')) {
      return;
    }

    try {
      setError('');
      setInfo('');
      await userService.deleteUser(id);
      setInfo('Usager supprimé avec succès');
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const filteredUsers =
    filter === 'ALL' ? users : users.filter((u) => u.role?.name === filter);

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return '#dc3545';
      case 'AGENT':
        return '#0066cc';
      case 'USER':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="page">
      <h1>Gestion des usagers</h1>
      <p className="muted">Affichage et gestion de tous les usagers du système.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {info && <div className="alert alert-success">{info}</div>}

      <div className="card">
        <div className="card__header">
          <h3>Tous les usagers ({filteredUsers.length})</h3>
          <div className="filter-group">
            <label htmlFor="roleFilter">Filtrer par rôle:</label>
            <select
              id="roleFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">Tous</option>
              <option value="ADMIN">Admin</option>
              <option value="AGENT">Agent</option>
              <option value="USER">Usager</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Chargement des usagers...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center muted">Aucun usager trouvé.</p>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nom complet</th>
                  <th>Rôle</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.email}</strong>
                    </td>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{ backgroundColor: getRoleColor(user.role?.name) }}
                      >
                        {user.role?.name}
                      </span>
                    </td>
                    <td>
                      <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        Détails
                      </button>
                      {user.role?.name !== 'ADMIN' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User details modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Détails de l'usager</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <dl className="details-list">
                <dt>Email</dt>
                <dd>{selectedUser.email}</dd>

                <dt>Prénom</dt>
                <dd>{selectedUser.firstName}</dd>

                <dt>Nom</dt>
                <dd>{selectedUser.lastName}</dd>

                <dt>Rôle</dt>
                <dd>
                  <span
                    className="badge"
                    style={{ backgroundColor: getRoleColor(selectedUser.role?.name) }}
                  >
                    {selectedUser.role?.name}
                  </span>
                </dd>

                <dt>ID</dt>
                <dd>
                  <code>{selectedUser.id}</code>
                </dd>

                <dt>Créé le</dt>
                <dd>{new Date(selectedUser.createdAt).toLocaleString()}</dd>

                {selectedUser.updatedAt && (
                  <>
                    <dt>Mise à jour</dt>
                    <dd>{new Date(selectedUser.updatedAt).toLocaleString()}</dd>
                  </>
                )}
              </dl>
            </div>
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSelectedUser(null)}
              >
                Fermer
              </button>
              {selectedUser.role?.name !== 'ADMIN' && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeleteUser(selectedUser.id);
                  }}
                >
                  Supprimer cet usager
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
