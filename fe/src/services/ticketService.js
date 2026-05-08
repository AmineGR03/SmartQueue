import api from '../api/client';

export async function getTickets() {
  const { data } = await api.get('/api/tickets');
  return data;
}

export async function createTicket(userId, serviceId) {
  const { data } = await api.post('/api/tickets', null, {
    params: { userId, serviceId },
  });
  return data;
}

export async function callNext() {
  const { data } = await api.put('/api/tickets/call-next');
  return data;
}

export async function completeTicket(id) {
  const { data } = await api.put(`/api/tickets/complete/${id}`);
  return data;
}
