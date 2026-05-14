/**
 * Data Formatting Utilities
 * Provides consistent data formatting for display and submission across the application
 */

/**
 * Format date to French locale
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'time'
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' },
    datetime: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  };

  return dateObj.toLocaleDateString('fr-FR', options[format] || options.short);
};

/**
 * Format time duration in minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return 'N/A';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}min`;
};

/**
 * Format ticket status to display label
 * @param {string} status - Ticket status (WAITING, CALLED, COMPLETED, CANCELLED)
 * @returns {Object} {label: string, color: string}
 */
export const formatTicketStatus = (status) => {
  const statusMap = {
    WAITING: { label: 'En attente', color: '#ffc107' },
    CALLED: { label: 'Appelé', color: '#0066cc' },
    COMPLETED: { label: 'Complété', color: '#28a745' },
    CANCELLED: { label: 'Annulé', color: '#dc3545' },
  };

  return statusMap[status] || { label: status, color: '#6c757d' };
};

/**
 * Format appointment status to display label
 * @param {string} status - Appointment status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Object} {label: string, color: string}
 */
export const formatAppointmentStatus = (status) => {
  const statusMap = {
    PENDING: { label: 'En attente', color: '#ffc107' },
    CONFIRMED: { label: 'Confirmé', color: '#28a745' },
    CANCELLED: { label: 'Annulé', color: '#dc3545' },
    COMPLETED: { label: 'Complété', color: '#0066cc' },
  };

  return statusMap[status] || { label: status, color: '#6c757d' };
};

/**
 * Format notification type to display label
 * @param {string} type - Notification type (INFO, WARNING, SUCCESS)
 * @returns {Object} {label: string, color: string, icon: string}
 */
export const formatNotificationType = (type) => {
  const typeMap = {
    INFO: { label: 'Information', color: '#0066cc', icon: 'ℹ️' },
    WARNING: { label: 'Avertissement', color: '#ffc107', icon: '⚠️' },
    SUCCESS: { label: 'Succès', color: '#28a745', icon: '✓' },
  };

  return typeMap[type] || { label: type, color: '#6c757d', icon: '•' };
};

/**
 * Format user role to display label
 * @param {string} role - User role (ADMIN, AGENT, USER)
 * @returns {Object} {label: string, color: string, badge: string}
 */
export const formatUserRole = (role) => {
  const roleMap = {
    ADMIN: { label: 'Administrateur', color: '#dc3545', badge: 'admin' },
    AGENT: { label: 'Agent', color: '#0066cc', badge: 'agent' },
    USER: { label: 'Utilisateur', color: '#28a745', badge: 'user' },
  };

  return roleMap[role] || { label: role, color: '#6c757d', badge: 'user' };
};

/**
 * Format full name from user object
 * @param {Object} user - User object with firstName, lastName
 * @returns {string} Full name
 */
export const formatUserFullName = (user) => {
  if (!user) return '';

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  return `${firstName} ${lastName}`.trim();
};

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 1)} ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone;
};

/**
 * Format ticket number
 * @param {string|number} ticketNumber - Ticket number
 * @returns {string} Formatted ticket number
 */
export const formatTicketNumber = (ticketNumber) => {
  return `#${ticketNumber}`;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default {
  formatDate,
  formatDuration,
  formatTicketStatus,
  formatAppointmentStatus,
  formatNotificationType,
  formatUserRole,
  formatUserFullName,
  formatPhoneNumber,
  formatTicketNumber,
  truncateText,
};
