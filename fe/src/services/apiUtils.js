/**
 * API Service Utilities
 * Provides common functions for API service handling
 */

import api from '../api/client';
import { getErrorMessage } from '../utils/errorUtils';

/**
 * Wrapper for GET requests with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} config - Axios config
 * @returns {Promise<any>}
 */
export async function apiGet(url, config = {}) {
  try {
    const { data } = await api.get(url, config);
    return data;
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Wrapper for POST requests with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} payload - Request body
 * @param {Object} config - Axios config
 * @returns {Promise<any>}
 */
export async function apiPost(url, payload, config = {}) {
  try {
    const { data } = await api.post(url, payload, config);
    return data;
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Wrapper for PUT requests with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} payload - Request body
 * @param {Object} config - Axios config
 * @returns {Promise<any>}
 */
export async function apiPut(url, payload, config = {}) {
  try {
    const { data } = await api.put(url, payload, config);
    return data;
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Wrapper for PATCH requests with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} payload - Request body
 * @param {Object} config - Axios config
 * @returns {Promise<any>}
 */
export async function apiPatch(url, payload, config = {}) {
  try {
    const { data } = await api.patch(url, payload, config);
    return data;
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Wrapper for DELETE requests with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} config - Axios config
 * @returns {Promise<any>}
 */
export async function apiDelete(url, config = {}) {
  try {
    const { data } = await api.delete(url, config);
    return data;
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

/**
 * Batch API calls with error handling
 * @param {Promise[]} promises - Array of promises
 * @returns {Promise<Array>}
 */
export async function apiBatch(promises) {
  try {
    return await Promise.all(promises);
  } catch (error) {
    throw {
      ...error,
      message: getErrorMessage(error),
    };
  }
}

export default {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  apiBatch,
};
