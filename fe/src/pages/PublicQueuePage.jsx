import React, { useCallback, useEffect, useState } from 'react';
import * as ticketService from '../services/ticketService';
import * as serviceService from '../services/serviceService';

export default function PublicQueuePage() {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [tickets, setTickets] = useState([]);
  const [myTicket, setMyTicket] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshTickets = useCallback(async () => {
    try {
      const list = await ticketService.getPublicTickets();
      setTickets(list);
    } catch (e) {
      console.error('Failed to refresh tickets:', e);
    }
  }, []);

  const initialLoad = useCallback(async () => {
    try {
      setLoading(true);
      // Load services independently (permitAll)
      const svcs = await serviceService.getServices();
      const activeSvcs = svcs.filter((s) => s.active);
      setServices(activeSvcs);
      setServiceId((prev) => {
        if (prev) return prev;
        return activeSvcs[0] ? String(activeSvcs[0].id) : '';
      });
    } catch (e) {
      setErr(e.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  // Refresh tickets every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTickets();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshTickets]);

  const getQueuePosition = () => {
    if (!myTicket) return 0;
    // Count waiting tickets created before this one (same day)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const waitingTickets = tickets.filter((t) => {
      if (t.status !== 'WAITING') return false;
      if (!t.createdAt) return false;
      const ticketDate = new Date(t.createdAt);
      if (ticketDate < today) return false;
      return ticketDate < new Date(myTicket.createdAt);
    });
    return waitingTickets.length;
  };

  const getEstimatedWaitTime = () => {
    if (!myTicket) return 0;
    const service = services.find((s) => s.id === Number(serviceId));
    if (!service) return 0;
    const position = getQueuePosition();
    return position * service.averageDuration;
  };

  const takeTicket = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setMyTicket(null);
    try {
      if (!serviceId) {
        setErr('Veuillez sélectionner un service');
        return;
      }
      const ticket = await ticketService.createAnonymousTicket(Number(serviceId));
      setMyTicket(ticket);
      setMsg('Ticket obtenu avec succès !');
      await refreshTickets();
    } catch (e2) {
      setErr(e2.response?.data?.message || e2.message || 'Erreur lors de la création du ticket');
    }
  };

  const countWaitingTickets = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return tickets.filter((t) => {
      if (t.status !== 'WAITING') return false;
      if (!t.createdAt) return false;
      const ticketDate = new Date(t.createdAt);
      return ticketDate >= today;
    }).length;
  };

  if (loading) {
    return (
      <div className="page">
        <h1>Gestion de la file d'attente</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Bienvenue à la file d'attente</h1>
      <p className="muted">
        Prenez un ticket pour votre service et suivez votre position dans la file.
      </p>

      {/* Display current queue status */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f0f9ff', borderLeft: '4px solid #0066cc' }}>
        <h3>📊 État actuel de la file d'attente</h3>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          <strong>{countWaitingTickets()}</strong> ticket{countWaitingTickets() !== 1 ? 's' : ''} en attente aujourd'hui
        </p>
      </div>

      {/* Ticket form */}
      <form className="card form-grid" onSubmit={takeTicket}>
        <h3>Obtenir un ticket</h3>
        <label>
          Service
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">— Choisir un service —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (~{s.averageDuration} min)
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit">
          Obtenir mon numéro
        </button>
        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-error">{err}</div>}
      </form>

      {/* Display ticket info */}
      {myTicket && (
        <div className="card" style={{ backgroundColor: '#f0fff4', borderLeft: '4px solid #22c55e' }}>
          <h3>✅ Votre ticket</h3>
          <div style={{ padding: '20px 0' }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Numéro de ticket:</p>
            <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#22c55e', margin: '10px 0' }}>
              {myTicket.number}
            </p>
            <hr style={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>AVANT VOUS</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
                  {getQueuePosition()}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>tickets en attente</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>TEMPS D'ATTENTE ESTIMÉ</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
                  {getEstimatedWaitTime()}
                </p>
                <p style={{ fontSize: '12px', color: '#999' }}>minutes</p>
              </div>
            </div>
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              ⏰ Créé à: {new Date(myTicket.createdAt).toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setMyTicket(null);
              setServiceId('');
              setMsg('');
            }}
          >
            Prendre un autre ticket
          </button>
        </div>
      )}

      {/* Queue info */}
      <section className="card" style={{ marginTop: '20px' }}>
        <h3>ℹ️ Information sur les services</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Durée moyenne</th>
              <th>En attente</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const serviceWaiting = tickets.filter(
                (t) => t.status === 'WAITING' && t.service?.id === s.id
              ).length;
              return (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.averageDuration} min</td>
                  <td>{serviceWaiting}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
