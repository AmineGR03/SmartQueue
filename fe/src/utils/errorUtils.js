/**
 * Error Utility Functions
 * Provides consistent error handling and formatting across the application
 */

/**
 * Parse error message from various error sources
 * @param {Error|Object} error - Error object
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Une erreur inconnue s\'est produite';

  // API error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error
  if (error.message) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return 'Une erreur inconnue s\'est produite';
};

/**
 * Get error status code
 * @param {Error|Object} error - Error object
 * @returns {number|null} HTTP status code
 */
export const getErrorStatus = (error) => {
  return error?.response?.status || null;
};

/**
 * Check if error is authentication-related
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return getErrorStatus(error) === 401;
};

/**
 * Check if error is authorization-related
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isAuthorizationError = (error) => {
  return getErrorStatus(error) === 403;
};

/**
 * Check if error is validation-related
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isValidationError = (error) => {
  return getErrorStatus(error) === 400;
};

/**
 * Check if error is server error
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isServerError = (error) => {
  const status = getErrorStatus(error);
  return status && status >= 500;
};

/**
 * Check if error is network error
 * @param {Error|Object} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return !error.response && error.message?.includes('Network');
};

/**
 * Format error for display to user
 * @param {Error|Object} error - Error object
 * @returns {Object} Formatted error {message, type}
 */
export const formatError = (error) => {
  const message = getErrorMessage(error);
  const status = getErrorStatus(error);

  let type = 'error';
  if (isAuthError(error)) {
    type = 'auth_error';
  } else if (isAuthorizationError(error)) {
    type = 'forbidden';
  } else if (isValidationError(error)) {
    type = 'validation_error';
  } else if (isServerError(error)) {
    type = 'server_error';
  } else if (isNetworkError(error)) {
    type = 'network_error';
  }

  return {
    message,
    type,
    status,
  };
};

/**
 * User-friendly French error messages
 */
export const errorMessages = {
  network_error: 'Erreur de connexion: vérifiez votre connexion internet',
  server_error: 'Erreur serveur: veuillez réessayer plus tard',
  auth_error: 'Votre session a expiré, veuillez vous reconnecter',
  forbidden: 'Accès refusé: vous n\'avez pas les permissions nécessaires',
  validation_error: 'Données invalides, veuillez vérifier votre formulaire',
  not_found: 'Ressource non trouvée',
  unknown_error: 'Une erreur inconnue s\'est produite',
};

export default {
  getErrorMessage,
  getErrorStatus,
  isAuthError,
  isAuthorizationError,
  isValidationError,
  isServerError,
  isNetworkError,
  formatError,
  errorMessages,
};
