import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as serviceService from '../services/serviceService';

/**
 * AppointmentForm Component
 * Form to create new appointments
 */
export default function AppointmentForm({ onSubmit, onCancel, loading = false }) {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [servicesLoading, setServicesLoading] = useState(true);

  // Load services on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const data = await serviceService.getServices();
        setServices(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, serviceId: data[0].id }));
        }
      } catch (err) {
        setError('Erreur lors du chargement des services');
      } finally {
        setServicesLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.serviceId) {
      setError('Veuillez sélectionner un service');
      return;
    }
    if (!formData.appointmentDate) {
      setError('Veuillez sélectionner une date');
      return;
    }
    if (!formData.appointmentTime) {
      setError('Veuillez sélectionner une heure');
      return;
    }

    // Combine date and time
    const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

    try {
      await onSubmit({
        serviceId: parseInt(formData.serviceId, 10),
        appointmentDate: appointmentDateTime,
        notes: formData.notes,
      });
      setFormData({ serviceId: '', appointmentDate: '', appointmentTime: '', notes: '' });
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du rendez-vous');
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="serviceId">Service *</label>
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            disabled={servicesLoading}
            required
          >
            <option value="">Sélectionner un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {servicesLoading && <small className="form-hint">Chargement des services...</small>}
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">Date du rendez-vous *</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            min={today}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">Heure du rendez-vous *</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
          <small className="form-hint">Format: HH:MM</small>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes (optionnel)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informations supplémentaires sur votre rendez-vous..."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le rendez-vous'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

AppointmentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  loading: PropTypes.bool,
};
