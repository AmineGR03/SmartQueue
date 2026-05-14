import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as appointmentService from '../services/appointmentService';
import * as ticketService from '../services/ticketService';
import * as notificationService from '../services/notificationService';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role?.name;
  const [stats, setStats] = useState({ pendingApt: 0, unread: 0, myTickets: 0, pendingQueue: 0 });

  const loadStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      if (role === 'USER') {
        const [apts, tickets, notifs] = await Promise.all([
          appointmentService.getAppointments(),
          ticketService.getTickets(),
          notificationService.getNotifications(user.id),
        ]);
        const mine = tickets.filter((t) => t.user?.id === user.id);
        setStats({
          pendingApt: apts.filter((a) => a.status === 'PENDING').length,
          unread: notifs.filter((n) => n.read === false).length,
          myTickets: mine.filter((t) => t.status === 'WAITING' || t.status === 'CALLED').length,
          pendingQueue: 0,
        });
      } else if (role === 'AGENT' || role === 'ADMIN') {
        const [apts, tickets] = await Promise.all([
          appointmentService.getAppointments(),
          ticketService.getTickets(),
        ]);
        setStats({
          pendingApt: apts.filter((a) => a.status === 'PENDING').length,
          unread: 0,
          myTickets: 0,
          pendingQueue: tickets.filter((t) => t.status === 'WAITING').length,
        });
      }
    } catch {
      /* ignore */
    }
  }, [user?.id, role]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Not logged in - show public queue
  if (!user) {
    return (
      <div className="page">
        <h1>Bienvenue à SmartQueue</h1>
        <p className="lead">
          Gestion intelligente des files d&apos;attente et des rendez-vous
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
          <div className="card">
            <h3>👥 Usager</h3>
            <p>Prenez un numéro, consultez votre position dans la file et vos rendez-vous.</p>
            <Link className="btn btn-primary" to="/public-queue" style={{ marginTop: '15px' }}>
              Accès public
            </Link>
          </div>
          <div className="card">
            <h3>🔐 Connexion</h3>
            <p>Connectez-vous avec votre compte pour accéder à l&apos;application complète.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Link className="btn btn-primary" to="/login">
                Connexion
              </Link>
              <Link className="btn btn-secondary" to="/register">
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged in - show dashboard content
  return (
    <div className="page">
      <h1>Bienvenue, {user.firstName} {user.lastName}</h1>
      <p className="muted">
        Rôle: <strong>{role}</strong>
      </p>

      {role === 'USER' && (
        <>
          <p className="lead">
            Prenez un ticket pour la file d&apos;attente, réservez un rendez-vous (en attente de confirmation par un
            agent) et consultez vos notifications.
          </p>
          <div className="grid-cards">
            <Link className="card highlight" to="/queue">
              <h3>File d&apos;attente</h3>
              <p>Obtenir un ticket — rejoindre la file pour un service.</p>
              {stats.myTickets > 0 && (
                <p className="badge">{stats.myTickets} ticket(s) en cours</p>
              )}
            </Link>
            <Link className="card highlight" to="/appointments">
              <h3>Rendez-vous</h3>
              <p>Réserver — la confirmation est faite par un agent.</p>
              {stats.pendingApt > 0 && <p className="badge">{stats.pendingApt} en attente de confirmation</p>}
            </Link>
            <Link className="card highlight" to="/notifications">
              <h3>Notifications</h3>
              <p>Confirmation de rendez-vous et alertes.</p>
              {stats.unread > 0 && <p className="badge">{stats.unread} non lue(s)</p>}
            </Link>
            <Link className="card" to="/services">
              <h3>Services</h3>
              <p>Liste des services disponibles.</p>
            </Link>
          </div>
        </>
      )}

      {role === 'AGENT' && (
        <>
          <p className="lead">
            Confirmez les rendez-vous des usagers, appelez la file et terminez les tickets. Vous ne gérez pas les
            services (création réservée à l&apos;admin).
          </p>
          <div className="grid-cards">
            <Link className="card highlight" to="/agent">
              <h3>Guichet</h3>
              <p>Tickets : appeler le suivant, terminer. Rendez-vous : confirmer les demandes usagers.</p>
              {stats.pendingQueue > 0 && <p className="badge">{stats.pendingQueue} ticket(s) en attente</p>}
              {stats.pendingApt > 0 && <p className="badge">{stats.pendingApt} RDV à confirmer</p>}
            </Link>
            <Link className="card" to="/queue">
              <h3>Prendre un ticket</h3>
              <p>Vous pouvez aussi rejoindre la file.</p>
            </Link>
            <Link className="card" to="/services">
              <h3>Services</h3>
              <p>Consultation uniquement.</p>
            </Link>
            <Link className="card" to="/notifications">
              <h3>Notifications</h3>
              <p>Vos messages internes.</p>
            </Link>
          </div>
        </>
      )}

      {role === 'ADMIN' && (
        <>
          <p className="lead">
            Super-utilisateur : accès complet — utilisateurs, services, file, rendez-vous, administration.
          </p>
          <div className="grid-cards">
            <Link className="card highlight" to="/queue">
              <h3>File d&apos;attente</h3>
              <p>Tickets et file en temps réel.</p>
            </Link>
            <Link className="card highlight" to="/agent">
              <h3>Guichet</h3>
              <p>Appeler / terminer les tickets comme un agent.</p>
            </Link>
            <Link className="card highlight" to="/appointments">
              <h3>Rendez-vous</h3>
              <p>Tous les rendez-vous ; création possible pour tout usager.</p>
            </Link>
            <Link className="card highlight" to="/services">
              <h3>Services</h3>
              <p>Ajouter ou supprimer des services.</p>
            </Link>
            <Link className="card highlight" to="/users">
              <h3>Usagers</h3>
              <p>Gestion des comptes.</p>
            </Link>
            <Link className="card highlight" to="/admin">
              <h3>Administration</h3>
              <p>Santé du système.</p>
            </Link>
            <Link className="card" to="/notifications">
              <h3>Notifications</h3>
              <p>Vos messages internes.</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
