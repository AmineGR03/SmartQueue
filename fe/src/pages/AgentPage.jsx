import React, { useCallback, useEffect, useState } from 'react';
import * as ticketService from '../services/ticketService';
import * as appointmentService from '../services/appointmentService';
import { useTicketSocket } from '../hooks/useTicketSocket';
import { useAuth } from '../context/AuthContext';

export default function AgentPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');

  const loadTickets = useCallback(async () => {
    const list = await ticketService.getTickets();
    setTickets(list);
  }, []);

  const loadAppointments = useCallback(async () => {
    const list = await appointmentService.getAppointments();
    setAppointments(list);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadTickets(), loadAppointments()]);
  }, [loadTickets, loadAppointments]);

  useEffect(() => {
    loadAll().catch((e) => setError(e.message));
  }, [loadAll]);

  useTicketSocket(() => loadTickets().catch(() => {}), Boolean(user));

  const onCallNext = async () => {
    setError('');
    setInfo('');
    try {
      const t = await ticketService.callNext();
      setInfo(`Ticket appelé : ${t.number}`);
      await loadTickets();
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
      await loadTickets();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  const onConfirmAppointment = async (id) => {
    setError('');
    setInfo('');
    try {
      await appointmentService.confirmAppointment(id);
      setInfo("Rendez-vous confirmé. L'usager sera notifié à sa prochaine connexion.");
      await loadAppointments();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  const pendingAppointments = appointments.filter((a) => a.status === 'PENDING');

  return (
    <div className="page">
      <h1>Guichet — agent / admin</h1>
      <p className="muted">
        Confirmez les rendez-vous des usagers, appelez et terminez les tickets de la file. La gestion des services
        (création / suppression) est réservée à l&apos;administrateur.
      </p>

      <div className="toolbar" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`btn ${tab === 'tickets' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTab('tickets')}
        >
          Tickets
        </button>
        <button
          type="button"
          className={`btn ${tab === 'rdv' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setTab('rdv')}
        >
          Rendez-vous à confirmer
          {pendingAppointments.length > 0 ? ` (${pendingAppointments.length})` : ''}
        </button>
      </div>

      {info && <div className="alert alert-success">{info}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {tab === 'tickets' && (
        <>
          <div className="toolbar">
            <button type="button" className="btn btn-primary" onClick={onCallNext}>
              Appeler le suivant
            </button>
          </div>
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
        </>
      )}

      {tab === 'rdv' && (
        <div className="card">
          <h3>Rendez-vous en attente de confirmation</h3>
          {!pendingAppointments.length ? (
            <p className="muted">Aucune demande en attente.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Usager (id)</th>
                  <th>Service</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pendingAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                    </td>
                    <td>{a.user?.id ?? '—'}</td>
                    <td>{a.service?.name || '—'}</td>
                    <td>{a.notes}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onConfirmAppointment(a.id)}
                      >
                        Confirmer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
