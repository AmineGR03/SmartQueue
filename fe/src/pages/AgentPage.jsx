import React, { useCallback, useEffect, useState } from 'react';
import * as ticketService from '../services/ticketService';
import { useTicketSocket } from '../hooks/useTicketSocket';
import { useAuth } from '../context/AuthContext';

export default function AgentPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const list = await ticketService.getTickets();
    setTickets(list);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  useTicketSocket(() => load().catch(() => {}), Boolean(user));

  const onCallNext = async () => {
    setError('');
    setInfo('');
    try {
      const t = await ticketService.callNext();
      setInfo(`Ticket appelé : ${t.number}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  const onComplete = async (id) => {
    setError('');
    setInfo('');
    try {
      const t = await ticketService.completeTicket(id);
      setInfo(`Ticket ${t.number} terminé`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  return (
    <div className="page">
      <h1>Guichet — agent</h1>
      <p className="muted">Actions réservées aux rôles AGENT et ADMIN.</p>
      <div className="toolbar">
        <button type="button" className="btn btn-primary" onClick={onCallNext}>
          Appeler le suivant
        </button>
      </div>
      {info && <div className="alert alert-success">{info}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h3>Tous les tickets</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Statut</th>
              <th>Usager</th>
              <th>Service</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td>{t.number}</td>
                <td>
                  <span className={`badge status-${t.status}`}>{t.status}</span>
                </td>
                <td>
                  {t.user
                    ? `${t.user.firstName || ''} ${t.user.lastName || ''} (${t.user.email})`
                    : '—'}
                </td>
                <td>{t.service?.name || '—'}</td>
                <td>
                  {t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onComplete(t.id)}
                    >
                      Terminer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
