import api from '../api/client';

/**
 * Liste des rendez-vous visibles selon le rôle (backend filtre USER ; ADMIN/AGENT voient tout).
 */
export async function getAppointments() {
  const { data } = await api.get('/api/appointments');
  return data;
}

export async function getAppointmentById(id) {
  try {
    const { data } = await api.get(`/api/appointments/${id}`);
    return data;
  } catch (error) {
    const appointments = await getAppointments();
    return appointments.find((a) => a.id === id);
  }
}

export async function createAppointment(appointment) {
  const { data } = await api.post('/api/appointments', appointment);
  return data;
}

/** Confirme un rendez-vous (AGENT ou ADMIN uniquement). */
export async function confirmAppointment(id) {
  const { data } = await api.put(`/api/appointments/${id}/confirm`);
  return data;
}

export async function cancelAppointment(id) {
  await api.delete(`/api/appointments/${id}`);
}

export async function updateAppointment(id, updates) {
  try {
    const { data } = await api.put(`/api/appointments/${id}`, updates);
    return data;
  } catch (error) {
    if (error.response?.status === 405 || error.response?.status === 404) {
      throw new Error('La modification des rendez-vous n\'est pas disponible');
    }
    throw error;
  }
}

export async function getUserAppointments(userId) {
  try {
    const { data } = await api.get(`/api/users/${userId}/appointments`);
    return data;
  } catch (error) {
    const appointments = await getAppointments();
    return appointments.filter((a) => a.user?.id === userId);
  }
}

export async function getAppointmentsByStatus(status) {
  const appointments = await getAppointments();
  return appointments.filter((a) => a.status === status);
}
