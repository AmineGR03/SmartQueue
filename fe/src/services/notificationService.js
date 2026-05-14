import api from '../api/client';

/**
 * Notification Management Services
 * Handles all notification-related API calls
 */

/**
 * Get notifications for a user (DTO list: id, message, read, type, createdAt, userId).
 * @param {number} userId - User ID
 * @returns {Promise<Array>} List of user notifications
 */
export async function getNotifications(userId) {
  const { data } = await api.get(`/api/notifications/${userId}`);
  return data;
}

/**
 * Create a notification (body: message, type, optional read, user: { id } or userId).
 * @param {Object} notification - Notification create DTO
 * @returns {Promise<Object>} Created notification DTO
 */
export async function createNotification(notification) {
  const body = { ...notification };
  if (body.userId != null && body.user == null) {
    body.user = { id: body.userId };
    delete body.userId;
  }
  const { data } = await api.post('/api/notifications', body);
  return data;
}

/**
 * Get unread notifications count for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Count of unread notifications
 */
export async function getUnreadCount(userId) {
  try {
    const { data } = await api.get(`/api/notifications/${userId}/unread-count`);
    return data.count || 0;
  } catch (error) {
    // Fallback: get all and filter
    const notifications = await getNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  }
}

/**
 * Mark notification as read (if endpoint is available)
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export async function markAsRead(notificationId) {
  try {
    const { data } = await api.put(`/api/notifications/${notificationId}/read`);
    return data;
  } catch (error) {
    // Endpoint might not exist
    throw new Error('La marque de notification comme lu n\'est pas disponible');
  }
}

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
export async function markAllAsRead(userId) {
  try {
    await api.put(`/api/notifications/${userId}/read-all`);
  } catch (error) {
    // If endpoint doesn't exist, skip
    console.warn('Marque tous comme lu n\'est pas disponible');
  }
}

/**
 * Delete a notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export async function deleteNotification(notificationId) {
  try {
    await api.delete(`/api/notifications/${notificationId}`);
  } catch (error) {
    throw new Error('Impossible de supprimer la notification');
  }
}
