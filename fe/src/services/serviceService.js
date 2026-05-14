import api from '../api/client';

/**
 * Service Management Services
 * Handles all service-related API calls
 */

/**
 * Get all services (DTO: id, name, description, averageDuration, active).
 * @returns {Promise<Array>} List of all services
 */
export async function getServices() {
  const { data } = await api.get('/api/services');
  return data;
}

/**
 * Get active services only
 * @returns {Promise<Array>} List of active services
 */
export async function getActiveServices() {
  try {
    const { data } = await api.get('/api/services', { params: { active: true } });
    return data;
  } catch (error) {
    // Fallback: filter locally
    const services = await getServices();
    return services.filter((s) => s.active);
  }
}

/**
 * Get service by ID
 * @param {number} id - Service ID
 * @returns {Promise<Object>} Service object
 */
export async function getServiceById(id) {
  try {
    const { data } = await api.get(`/api/services/${id}`);
    return data;
  } catch (error) {
    // Fallback: get all and find
    const services = await getServices();
    return services.find((s) => s.id === id);
  }
}

/**
 * Create a new service (admin only). Body matches ServiceDTO (no id on create).
 * @param {Object} service - { name, description?, averageDuration?, active? }
 * @returns {Promise<Object>} Created service DTO
 */
export async function createService(service) {
  const { data } = await api.post('/api/services', service);
  return data;
}

/**
 * Update a service (if endpoint is available)
 * @param {number} id - Service ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated service
 */
export async function updateService(id, updates) {
  try {
    const { data } = await api.put(`/api/services/${id}`, updates);
    return data;
  } catch (error) {
    if (error.response?.status === 405 || error.response?.status === 404) {
      throw new Error('La modification des services n\'est pas disponible');
    }
    throw error;
  }
}

/**
 * Delete a service (admin only)
 * @param {number} id - Service ID
 * @returns {Promise<void>}
 */
export async function deleteService(id) {
  await api.delete(`/api/services/${id}`);
}

/**
 * Search services by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching services
 */
export async function searchServices(query) {
  try {
    const { data } = await api.get('/api/services/search', {
      params: { q: query },
    });
    return data;
  } catch (error) {
    // Fallback: filter locally
    const services = await getServices();
    const lowerQuery = query.toLowerCase();
    return services.filter(
      (s) =>
        s.name?.toLowerCase().includes(lowerQuery) ||
        s.description?.toLowerCase().includes(lowerQuery)
    );
  }
}
