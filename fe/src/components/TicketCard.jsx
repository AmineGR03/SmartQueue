import React from 'react';
import PropTypes from 'prop-types';

/**
 * TicketCard Component
 * Displays a ticket in card format with key information and actions
 */
export default function TicketCard({
  ticket,
  onComplete,
  onCancel,
  onView,
  showActions = true,
  loading = false,
}) {
  const canComplete = ticket.status !== 'COMPLETED' && ticket.status !== 'CANCELLED';
  const canCancel = ticket.status === 'WAITING' || ticket.status === 'CALLED';

  const statusColor = {
    WAITING: '#ffc107',
    CALLED: '#17a2b8',
    COMPLETED: '#28a745',
    CANCELLED: '#dc3545',
  }[ticket.status] || '#6c757d';

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <div className="ticket-card__number" style={{ color: statusColor }}>
          #{ticket.number}
        </div>
        <span className={`badge status-${ticket.status?.toLowerCase()}`}>
          {ticket.status}
        </span>
      </div>

      <div className="ticket-card__body">
        <div className="ticket-card__info">
          <p>
            <strong>Service:</strong> {ticket.service?.name || '—'}
          </p>
          {ticket.user && (
            <p>
              <strong>Usager:</strong> {ticket.user.firstName} {ticket.user.lastName}
            </p>
          )}
          {ticket.agent && (
            <p>
              <strong>Agent:</strong> {ticket.agent.firstName} {ticket.agent.lastName}
            </p>
          )}
          {ticket.counter && (
            <p>
              <strong>Guichet:</strong> {ticket.counter.name}
            </p>
          )}
          <p className="muted">
            <small>Créé: {new Date(ticket.createdAt).toLocaleString()}</small>
          </p>
        </div>

        {showActions && (
          <div className="ticket-card__actions">
            {onView && (
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => onView(ticket)}
                disabled={loading}
              >
                Voir détails
              </button>
            )}
            {onComplete && canComplete && (
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => onComplete(ticket.id)}
                disabled={loading}
              >
                Terminer
              </button>
            )}
            {onCancel && canCancel && (
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => onCancel(ticket.id)}
                disabled={loading}
              >
                Annuler
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    service: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    user: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
    }),
    agent: PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    counter: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string,
  }).isRequired,
  onComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onView: PropTypes.func,
  showActions: PropTypes.bool,
  loading: PropTypes.bool,
};
