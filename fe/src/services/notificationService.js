import api from '../api/client';

export async function getNotifications(userId) {
  const { data } = await api.get(`/api/notifications/${userId}`);
  return data;
}

export async function createNotification(notification) {
  const { data } = await api.post('/api/notifications', notification);
  return data;
}
