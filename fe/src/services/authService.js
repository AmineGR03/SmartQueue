import api from '../api/client';

/**
 * Authentication Services
 * Handles all authentication-related API calls
 */

/**
 * User login
 * @param {Object} credentials - {email, password}
 * @returns {Promise<Object>} {token: JWT_TOKEN}
 */
export async function login({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password });
  return data;
}

/**
 * User registration
 * @param {Object} payload - User registration data
 * @returns {Promise<Object>} {token: JWT_TOKEN}
 */
export async function register(payload) {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
}

/**
 * Get current user profile (DTO: no password; includes role.id and role.name).
 * @returns {Promise<Object>} User profile
 */
export async function getMe() {
  const { data } = await api.get('/api/auth/me');
  return data;
}

/**
 * Refresh JWT token
 * @returns {Promise<Object>} {token: NEW_JWT_TOKEN}
 */
export async function refreshToken() {
  const { data } = await api.post('/api/auth/refresh', {});
  return data;
}

/**
 * Logout (optional - mainly for backend session cleanup)
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await api.post('/api/auth/logout', {});
  } catch (error) {
    // Logout failure is not critical - token will be removed client-side anyway
    console.warn('Logout request failed:', error.message);
  }
}

/**
 * Request password reset (if endpoint is available)
 * @param {string} email - User email
 * @returns {Promise<Object>} Reset request response
 */
export async function requestPasswordReset(email) {
  try {
    const { data } = await api.post('/api/auth/forgot-password', { email });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Cet email n\'est pas enregistré');
    }
    throw error;
  }
}

/**
 * Reset password with token (if endpoint is available)
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Reset response
 */
export async function resetPassword(token, newPassword) {
  try {
    const { data } = await api.post('/api/auth/reset-password', {
      token,
      newPassword,
    });
    return data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Le token de réinitialisation est invalide ou expiré');
    }
    throw error;
  }
}

/**
 * Change password (if endpoint is available)
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Change response
 */
export async function changePassword(oldPassword, newPassword) {
  try {
    const { data } = await api.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('L\'ancien mot de passe est incorrect');
    }
    throw error;
  }
}

