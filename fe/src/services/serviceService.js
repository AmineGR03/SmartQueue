import api from '../api/client';

export async function getServices() {
  const { data } = await api.get('/api/services');
  return data;
}

export async function createService(service) {
  const { data } = await api.post('/api/services', service);
  return data;
}

export async function deleteService(id) {
  await api.delete(`/api/services/${id}`);
}
