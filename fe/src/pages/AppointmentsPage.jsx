import React, { useCallback, useEffect, useState } from 'react';
import * as appointmentService from '../services/appointmentService';
import * as serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const role = user?.role?.name;
  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [apts, svcs] = await Promise.all([
      appointmentService.getAppointments(),
      serviceService.getServices(),
    ]);
    setAppointments(apts);
    setServices(svcs);
    setServiceId((id) => id || (svcs[0] ? String(svcs[0].id) : ''));
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) return;
    try {
      const payload = {
        appointmentDate: appointmentDate
          ? new Date(appointmentDate).toISOString().slice(0, 19)
          : null,
        notes,
        user: { id: isAdmin && targetUserId ? Number(targetUserId) : user.id },
        service: { id: Number(serviceId) },
      };
      if (isAdmin) {
        payload.status = status;
      }
      await appointmentService.createAppointment(payload);
      setNotes('');
      setAppointmentDate('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const cancel = async (id) => {
    if (!window.confirm('Annuler ce rendez-vous ?')) return;
    setError('');
    try {
      await appointmentService.cancelAppointment(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const visibleAppointments =
    isAdmin ? appointments : appointments.filter((a) => !a.user?.id || a.user?.id === user?.id);

  const canCancel = (a) => {
    if (a.status === 'CANCELLED') return false;
    if (isAdmin) return true;
    if (isUser && a.user?.id === user?.id) return true;
    return false;
  };

  return (
    <div className="page">
      <h1>Rendez-vous</h1>
      {isUser && (
        <p className="muted">
          Votre demande est en <strong>attente de confirmation</strong> par un agent. Vous serez notifié à la
          prochaine connexion en cas de confirmation. Vous pouvez <strong>annuler</strong> à tout moment.
        </p>
      )}
      {isAdmin && (
        <p className="muted">
          Super-utilisateur : vous pouvez créer un rendez-vous pour n&apos;importe quel usager (identifiant
          utilisateur).
        </p>
      )}

      {(isUser || isAdmin) && (
        <form className="card form-grid" onSubmit={submit}>
          <h3>Nouveau rendez-vous</h3>
          {isAdmin && (
            <label>
              ID utilisateur concerné
              <input
                type="number"
                min={1}
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                placeholder={`Par défaut : vous (${user.id})`}
              />
            </label>
          )}
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
          <label>
            Date et heure
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </label>
          {isAdmin && (
            <label>
              Statut initial
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </label>
          <button className="btn btn-primary" type="submit">
            {isAdmin ? 'Créer le rendez-vous' : 'Demander un rendez-vous'}
          </button>
        </form>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h3>{isAdmin ? 'Tous les rendez-vous' : 'Mes rendez-vous'}</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Statut</th>
              <th>Service</th>
              <th>Notes</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibleAppointments.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}
                </td>
                <td>{a.status}</td>
                <td>{a.service?.name || '—'}</td>
                <td>{a.notes}</td>
                <td>
                  {canCancel(a) && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => cancel(a.id)}
                    >
                      Annuler
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
