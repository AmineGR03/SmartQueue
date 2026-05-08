import React, { useCallback, useEffect, useState } from 'react';
import * as notificationService from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

const types = ['INFO', 'WARNING', 'SUCCESS'];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    const list = await notificationService.getNotifications(user.id);
    setItems(list);
  }, [user?.id]);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const send = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await notificationService.createNotification({
        message,
        type,
        read: false,
        user: { id: user.id },
      });
      setMessage('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page">
      <h1>Notifications</h1>
      <form className="card form-grid" onSubmit={send}>
        <h3>Créer une notification (test)</h3>
        <label>
          Message
          <input value={message} onChange={(e) => setMessage(e.target.value)} required />
        </label>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Envoyer à moi-même
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <h3>Liste</h3>
        {!items?.length ? (
          <p className="muted">Aucune notification.</p>
        ) : (
          <ul className="notif-list">
            {items.map((n) => (
              <li key={n.id} className={`notif notif-${n.type}`}>
                <strong>{n.type}</strong>
                <span>{n.message}</span>
                <small>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
