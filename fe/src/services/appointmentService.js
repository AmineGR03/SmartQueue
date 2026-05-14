import api from '../api/client';

/**
 * Appointment Management Services
 * Handles all appointment-related API calls
 */

/**
 * Get all appointments
 * @returns {Promise<Array>} List of all appointments (filtered by role)
 */
export async function getAppointments() {
  const { data } = await api.get('/api/appointments');
  return data;
}

/**
 * Get appointment by ID (if endpoint is available)
 * @param {number} id - Appointment ID
 * @returns {Promise<Object>} Appointment object
 */
export async function getAppointmentById(id) {
  try {
    const { data } = await api.get(`/api/appointments/${id}`);
    return data;
  } catch (error) {
    // Fallback: get all and find
    const appointments = await getAppointments();
    return appointments.find((a) => a.id === id);
  }
}

/**
 * Create a new appointment
 * @param {Object} appointment - Appointment data
 * @returns {Promise<Object>} Created appointment
 */
export async function createAppointment(appointment) {
  const { data } = await api.post('/api/appointments', appointment);
  return data;
}

/**
 * Cancel an appointment
 * @param {number} id - Appointment ID
 * @returns {Promise<void>}
 */
export async function cancelAppointment(id) {
  await api.delete(`/api/appointments/${id}`);
}

/**
 * Update an appointment (if endpoint is available)
 * @param {number} id - Appointment ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated appointment
 */
export async function updateAppointment(id, updates) {
  try {
    const { data } = await api.put(`/api/appointments/${id}`, updates);
    return data;
  } catch (error) {
    // If endpoint doesn't exist, throw with proper message
    if (error.response?.status === 405 || error.response?.status === 404) {
      throw new Error('La modification des rendez-vous n\'est pas disponible');
    }
    throw error;
  }
}

/**
 * Get appointments for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} User's appointments
 */
export async function getUserAppointments(userId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/appointments`);
    return data;
  } catch (error) {
    // Fallback: get all and filter
    const appointments = await getAppointments();
    return appointments.filter((a) => a.user?.id === userId);
  }
}

/**
 * Get appointments by status
 * @param {string} status - Appointment status (PENDING, CONFIRMED, CANCELLED, COMPLETED)
 * @returns {Promise<Array>} Appointments with specified status
 */
export async function getAppointmentsByStatus(status) {
  try {
    const { data } = await api.get('/api/appointments', { params: { status } });
    return data;
  } catch (error) {
    // Fallback: filter locally
    const appointments = await getAppointments();
    return appointments.filter((a) => a.status === status);
  }
}
