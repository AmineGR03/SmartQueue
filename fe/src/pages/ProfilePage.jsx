import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setLoading(true);

    try {
      await userService.updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      setMsg('Profil mis à jour avec succès !');
      // Optionally refresh user context here
    } catch (error) {
      setErr(error.response?.data?.message || error.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="page">
      <h1>Mon Profil</h1>
      <p className="muted">Gérez vos informations personnelles</p>

      <div className="grid" style={{ maxWidth: '600px' }}>
        <div className="card">
          <h3>Informations personnelles</h3>

          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Prénom
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Votre prénom"
              />
            </label>

            <label>
              Nom
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Votre email"
                disabled
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'En cours...' : 'Enregistrer'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Retour
              </button>
            </div>

            {msg && <div className="alert alert-success">{msg}</div>}
            {err && <div className="alert alert-error">{err}</div>}
          </form>
        </div>

        <div className="card">
          <h3>Informations du compte</h3>
          <dl style={{ marginTop: '15px' }}>
            <dt>Rôle</dt>
            <dd style={{ marginBottom: '15px', fontWeight: 'bold', color: '#0066cc' }}>
              {user.role?.name}
            </dd>
            <dt>Email</dt>
            <dd style={{ marginBottom: '15px' }}>{user.email}</dd>
            <dt>Compte créé</dt>
            <dd>
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
