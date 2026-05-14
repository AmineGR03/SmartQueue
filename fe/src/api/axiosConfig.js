/**
 * Axios Configuration File
 * Configures API client with JWT authentication and error handling
 * Note: The actual interceptor setup is in client.js
 * This file is kept for backward compatibility and configuration reference
 */

import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Configure axios instance with JWT support
 * Returns configured axios instance with:
 * - Authorization header injection
 * - Token refresh on 401
 * - Error message mapping to French
 */
export const configureAxios = (instance) => {
  // Request interceptor - add auth token to all requests
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - handle errors and token expiration
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried, try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const refreshResponse = await axios.post(
            `${baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          if (refreshResponse.data.token) {
            localStorage.setItem('token', refreshResponse.data.token);
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed - redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle specific error cases with French messages
      if (error.response?.status === 403) {
        error.message = 'Accès refusé: vous n\'avez pas les permissions nécessaires';
      } else if (error.response?.status === 404) {
        error.message = error.response?.data?.message || 'Ressource non trouvée';
      } else if (error.response?.status === 400) {
        error.message = error.response?.data?.message || 'Requête invalide';
      } else if (error.response?.status === 500) {
        error.message = 'Erreur serveur: veuillez réessayer plus tard';
      } else if (!error.response) {
        error.message = 'Erreur de connexion: vérifiez votre connexion internet';
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default { configureAxios };
