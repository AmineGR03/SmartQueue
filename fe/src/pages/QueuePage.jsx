import React, { useCallback, useEffect, useState } from 'react';
import * as ticketService from '../services/ticketService';
import * as serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';
import { useTicketSocket } from '../hooks/useTicketSocket';

export default function QueuePage() {
  const { user } = useAuth();
  const role = user?.role?.name;
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [tickets, setTickets] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const refreshTickets = useCallback(async () => {
    const list = await ticketService.getTickets();
    setTickets(list);
  }, []);

  const initialLoad = useCallback(async () => {
    const [list, svcs] = await Promise.all([
      ticketService.getTickets(),
      serviceService.getServices(),
    ]);
    setTickets(list);
    setServices(svcs);
    setServiceId((prev) => {
      if (prev) return prev;
      return svcs[0] ? String(svcs[0].id) : '';
    });
  }, []);

  useEffect(() => {
    initialLoad().catch((e) => setErr(e.message));
  }, [initialLoad]);

  useTicketSocket(() => {
    refreshTickets().catch(() => {});
  }, Boolean(user));

  const takeTicket = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    try {
      await ticketService.createTicket(user.id, Number(serviceId));
      setMsg('Ticket créé avec succès.');
      await refreshTickets();
    } catch (e2) {
      setErr(e2.response?.data?.message || e2.message);
    }
  };

  const mine = tickets.filter((t) => t.user?.id === user?.id);

  return (
    <div className="page">
      <h1>File d&apos;attente</h1>
      <p className="muted">
        Tous les rôles (usager, agent, administrateur) peuvent prendre un ticket et rejoindre la file pour un service.
        Mises à jour en temps réel via WebSocket (<code>/topic/tickets</code>).
      </p>
      {role && role !== 'USER' && (
        <p className="muted">
          Compte <strong>{role}</strong> : vous voyez ci-dessous vos propres tickets ; le guichet agent liste tous les
          tickets pour appeler / terminer.
        </p>
      )}

      <form className="card form-grid" onSubmit={takeTicket}>
        <h3>Nouveau ticket</h3>
        <label>
          Service
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">— Choisir —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Obtenir un numéro
        </button>
        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-error">{err}</div>}
      </form>

      <section className="card">
        <h3>Mes tickets</h3>
        {!mine.length ? (
          <p className="muted">Aucun ticket pour le moment.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Statut</th>
                <th>Service</th>
                <th>Créé le</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((t) => (
                <tr key={t.id}>
                  <td>{t.number}</td>
                  <td>
                    <span className={`badge status-${t.status}`}>{t.status}</span>
                  </td>
                  <td>{t.service?.name || '—'}</td>
                  <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
