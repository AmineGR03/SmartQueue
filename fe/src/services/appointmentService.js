import api from '../api/client';

export async function getAppointments() {
  const { data } = await api.get('/api/appointments');
  return data;
}

export async function createAppointment(appointment) {
  const { data } = await api.post('/api/appointments', appointment);
  return data;
}

export async function cancelAppointment(id) {
  await api.delete(`/api/appointments/${id}`);
}
