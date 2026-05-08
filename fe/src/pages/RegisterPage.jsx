import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Inscription impossible');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Inscription</h1>
      <form className="card form-grid" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{String(error)}</div>}
        <div className="form-row">
          <label>
            Prénom
            <input value={form.firstName} onChange={change('firstName')} required />
          </label>
          <label>
            Nom
            <input value={form.lastName} onChange={change('lastName')} required />
          </label>
        </div>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={change('email')} required />
        </label>
        <label>
          Téléphone
          <input value={form.phone} onChange={change('phone')} />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={form.password}
            onChange={change('password')}
            required
            minLength={6}
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Création…' : 'Créer mon compte'}
        </button>
        <p className="form-footer">
          Déjà un compte ? <Link to="/login">Connexion</Link>
        </p>
      </form>
    </div>
  );
}
