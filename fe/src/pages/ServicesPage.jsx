import React, { useCallback, useEffect, useState } from 'react';
import * as serviceService from '../services/serviceService';
import { useAuth } from '../context/AuthContext';

export default function ServicesPage() {
  const { user } = useAuth();
  const role = user?.role?.name;
  const admin = role === 'ADMIN';
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [averageDuration, setAverageDuration] = useState(15);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const list = await serviceService.getServices();
    setServices(list);
  }, []);

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await serviceService.createService({
        name,
        description,
        averageDuration: Number(averageDuration),
        active: true,
      });
      setName('');
      setDescription('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    setError('');
    try {
      await serviceService.deleteService(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page">
      <h1>Services</h1>
      {admin && (
        <form className="card form-grid" onSubmit={onCreate}>
          <h3>Nouveau service</h3>
          <label>
            Nom
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Durée moyenne (minutes)
            <input
              type="number"
              min={1}
              value={averageDuration}
              onChange={(e) => setAverageDuration(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" type="submit">
            Ajouter
          </button>
        </form>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <h3>Liste des services</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Durée</th>
              <th>Actif</th>
              {admin && <th />}
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{s.averageDuration} min</td>
                <td>{s.active ? 'Oui' : 'Non'}</td>
                {admin && (
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onDelete(s.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
