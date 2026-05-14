/**
 * Form Validation Utilities
 * Provides consistent validation functions for forms across the application
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {Object} {valid: boolean, errors: string[]}
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push('Le mot de passe est requis');
  } else {
    if (password.length < 6) {
      errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate name (first/last name)
 * @param {string} name - Name
 * @returns {boolean}
 */
export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

/**
 * Validate registration form
 * @param {Object} formData - Form data {firstName, lastName, email, password, phone}
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};

  if (!validateName(formData.firstName)) {
    errors.firstName = 'Le prénom doit contenir entre 2 et 50 caractères';
  }

  if (!validateName(formData.lastName)) {
    errors.lastName = 'Le nom doit contenir entre 2 et 50 caractères';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'L\'adresse e-mail n\'est pas valide';
  }

  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors[0];
  }

  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Le numéro de téléphone n\'est pas valide';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 * @param {Object} formData - Form data {email, password}
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'L\'adresse e-mail n\'est pas valide';
  }

  if (!formData.password) {
    errors.password = 'Le mot de passe est requis';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate appointment form
 * @param {Object} formData - Form data {serviceId, appointmentDate}
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateAppointmentForm = (formData) => {
  const errors = {};

  if (!formData.serviceId) {
    errors.serviceId = 'Veuillez sélectionner un service';
  }

  if (!formData.appointmentDate) {
    errors.appointmentDate = 'Veuillez sélectionner une date et une heure';
  } else {
    const appointmentDate = new Date(formData.appointmentDate);
    const now = new Date();
    if (appointmentDate < now) {
      errors.appointmentDate = 'La date ne peut pas être dans le passé';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate service form
 * @param {Object} formData - Form data {name, description, averageDuration}
 * @returns {Object} {valid: boolean, errors: Object}
 */
export const validateServiceForm = (formData) => {
  const errors = {};

  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = 'Le nom du service est requis';
  } else if (formData.name.length > 100) {
    errors.name = 'Le nom du service ne doit pas dépasser 100 caractères';
  }

  if (formData.description && formData.description.length > 500) {
    errors.description = 'La description ne doit pas dépasser 500 caractères';
  }

  if (!formData.averageDuration || formData.averageDuration < 1) {
    errors.averageDuration = 'La durée moyenne doit être au moins 1 minute';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateRegistrationForm,
  validateLoginForm,
  validateAppointmentForm,
  validateServiceForm,
};
