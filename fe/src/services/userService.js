import api from '../api/client';

/**
 * User Management Services
 * Handles all user-related API calls
 */

/**
 * Get all users (admin only). Each item is a UserDTO (no password; role.id + role.name).
 * @returns {Promise<Array>} List of all users
 */
export async function getAllUsers() {
  const { data } = await api.get('/api/users');
  return data;
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User object
 */
export async function getUserById(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data;
}

/**
 * Delete user (admin only)
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  await api.delete(`/api/users/${id}`);
}

/**
 * Update user (if endpoint is available on backend)
 * @param {number} id - User ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated user object
 */
export async function updateUser(id, updates) {
  try {
    const { data } = await api.put(`/api/users/${id}`, updates);
    return data;
  } catch (error) {
    // If endpoint doesn't exist, throw with proper message
    if (error.response?.status === 405 || error.response?.status === 404) {
      throw new Error('La modification des utilisateurs n\'est pas disponible');
    }
    throw error;
  }
}

/**
 * Search users (if endpoint is available)
 * @param {string} query - Search query
 * @returns {Promise<Array>} Filtered users
 */
export async function searchUsers(query) {
  try {
    const { data } = await api.get('/api/users/search', {
      params: { q: query },
    });
    return data;
  } catch (error) {
    // Fallback: return all users and filter locally
    const allUsers = await getAllUsers();
    const lowerQuery = query.toLowerCase();
    return allUsers.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(lowerQuery) ||
        u.lastName?.toLowerCase().includes(lowerQuery) ||
        u.email?.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Get users by role
 * @param {string} roleName - Role name (ADMIN, AGENT, USER)
 * @returns {Promise<Array>} Users with specified role
 */
export async function getUsersByRole(roleName) {
  try {
    const { data } = await api.get(`/api/users/role/${roleName}`);
    return data;
  } catch (error) {
    // Fallback: filter locally
    const allUsers = await getAllUsers();
    return allUsers.filter((u) => u.role?.name === roleName);
  }
}
