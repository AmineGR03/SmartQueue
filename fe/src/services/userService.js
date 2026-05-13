import api from '../api/client';

/**
 * User Management Services
 */

export async function getAllUsers() {
  const { data } = await api.get('/api/users');
  return data;
}

export async function getUserById(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data;
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/api/users/${id}`);
  return data;
}

export async function updateUser(id, updates) {
  const { data } = await api.put(`/api/users/${id}`, updates);
  return data;
}
