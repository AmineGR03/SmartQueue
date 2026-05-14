import api from '../api/client';

/**
 * Admin Services
 * Handles all admin-related API calls
 * These endpoints require ADMIN role
 */

/**
 * Get system health check
 * @returns {Promise<Object>} Health status
 */
export async function adminHealth() {
  const { data } = await api.get('/api/admin/health');
  return data;
}

/**
 * Get system statistics (if endpoint is available)
 * @returns {Promise<Object>} System statistics
 */
export async function getStatistics() {
  try {
    const { data } = await api.get('/api/admin/statistics');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Les statistiques ne sont pas disponibles');
    }
    throw error;
  }
}

/**
 * Get dashboard metrics (if endpoint is available)
 * @returns {Promise<Object>} Dashboard metrics
 */
export async function getDashboardMetrics() {
  try {
    const { data } = await api.get('/api/admin/metrics');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Les métriques ne sont pas disponibles');
    }
    throw error;
  }
}

/**
 * Get application logs (if endpoint is available)
 * @returns {Promise<Array>} Application logs
 */
export async function getLogs() {
  try {
    const { data } = await api.get('/api/admin/logs');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Les journaux ne sont pas disponibles');
    }
    throw error;
  }
}

/**
 * Clear system cache (if endpoint is available)
 * @returns {Promise<Object>} Cache clear response
 */
export async function clearCache() {
  try {
    const { data } = await api.post('/api/admin/cache/clear');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('La gestion du cache n\'est pas disponible');
    }
    throw error;
  }
}

/**
 * Get system configuration (if endpoint is available)
 * @returns {Promise<Object>} System configuration
 */
export async function getSystemConfig() {
  try {
    const { data } = await api.get('/api/admin/config');
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('La configuration système n\'est pas disponible');
    }
    throw error;
  }
}
