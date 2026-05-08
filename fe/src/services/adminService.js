import api from '../api/client';

export async function adminHealth() {
  const { data } = await api.get('/api/admin/health');
  return data;
}
