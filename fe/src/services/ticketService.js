import api from '../api/client';

/**
 * Ticket Management Services
 * Handles all ticket-related API calls
 */

/**
 * Get all tickets
 * @returns {Promise<Array>} List of all tickets
 */
export async function getTickets() {
  const { data } = await api.get('/api/tickets');
  return data;
}

/**
 * Get ticket by ID (if endpoint is available)
 * @param {number} id - Ticket ID
 * @returns {Promise<Object>} Ticket object
 */
export async function getTicketById(id) {
  try {
    const { data } = await api.get(`/api/tickets/${id}`);
    return data;
  } catch (error) {
    // Fallback: get all and find
    const tickets = await getTickets();
    return tickets.find((t) => t.id === id);
  }
}

/**
 * Create a new ticket for a service
 * @param {number} userId - User ID
 * @param {number} serviceId - Service ID
 * @returns {Promise<Object>} Created ticket
 */
export async function createTicket(userId, serviceId) {
  const { data } = await api.post('/api/tickets', null, {
    params: { userId, serviceId },
  });
  return data;
}

/**
 * Create an anonymous ticket (no authentication required)
 * @param {number} serviceId - Service ID
 * @returns {Promise<Object>} Created ticket
 */
export async function createAnonymousTicket(serviceId) {
  const { data } = await api.post('/api/tickets/anonymous', null, {
    params: { serviceId },
  });
  return data;
}

/**
 * Call next ticket in queue (agent/admin only)
 * @returns {Promise<Object>} Called ticket
 */
export async function callNext() {
  const { data } = await api.put('/api/tickets/call-next');
  return data;
}

/**
 * Complete a ticket (agent/admin only)
 * @param {number} id - Ticket ID
 * @returns {Promise<Object>} Completed ticket
 */
export async function completeTicket(id) {
  const { data } = await api.put(`/api/tickets/complete/${id}`);
  return data;
}

/**
 * Cancel a ticket (if endpoint is available)
 * @param {number} id - Ticket ID
 * @returns {Promise<Object>} Cancelled ticket
 */
export async function cancelTicket(id) {
  try {
    const { data } = await api.put(`/api/tickets/cancel/${id}`);
    return data;
  } catch (error) {
    // Fallback: try DELETE
    try {
      await api.delete(`/api/tickets/${id}`);
      return { id, status: 'CANCELLED' };
    } catch {
      throw error;
    }
  }
}

/**
 * Get tickets for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} User's tickets
 */
export async function getUserTickets(userId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/tickets`);
    return data;
  } catch (error) {
    // Fallback: get all and filter
    const tickets = await getTickets();
    return tickets.filter((t) => t.user?.id === userId);
  }
}

/**
 * Get tickets by status
 * @param {string} status - Ticket status (WAITING, CALLED, COMPLETED, CANCELLED)
 * @returns {Promise<Array>} Tickets with specified status
 */
export async function getTicketsByStatus(status) {
  try {
    const { data } = await api.get('/api/tickets', { params: { status } });
    return data;
  } catch (error) {
    // Fallback: filter locally
    const tickets = await getTickets();
    return tickets.filter((t) => t.status === status);
  }
}
