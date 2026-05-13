# Frontend Implementation Guide - SmartQueue Backend Integration

## Overview
This guide provides detailed instructions for implementing frontend features that match the backend capabilities of SmartQueue.

---

## Table of Contents
1. [Authentication Implementation](#authentication-implementation)
2. [API Service Setup](#api-service-setup)
3. [Component Integration](#component-integration)
4. [WebSocket Setup](#websocket-setup)
5. [Data Management](#data-management)
6. [State Management](#state-management)

---

## Authentication Implementation

### JWT Token Management

```javascript
// File: src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', userData.email);
    }
    
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
    }
    
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
```

### Axios Interceptor for JWT

```javascript
// File: src/api/axiosConfig.js
import axios from 'axios';
import authService from './authService';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add request interceptor
instance.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
```

---

## API Service Setup

### User Service

```javascript
// File: src/services/userService.js
import client from '../api/client';

const userService = {
  getAllUsers: async () => {
    return client.get('/users');
  },

  getUserById: async (id) => {
    return client.get(`/users/${id}`);
  },

  deleteUser: async (id) => {
    return client.delete(`/users/${id}`);
  }
};

export default userService;
```

### Ticket Service

```javascript
// File: src/services/ticketService.js
import client from '../api/client';

const ticketService = {
  createTicket: async (userId, serviceId) => {
    return client.post(`/tickets?userId=${userId}&serviceId=${serviceId}`);
  },

  getAllTickets: async () => {
    return client.get('/tickets');
  },

  callNextTicket: async () => {
    return client.put('/tickets/call-next');
  },

  completeTicket: async (ticketId) => {
    return client.put(`/tickets/complete/${ticketId}`);
  }
};

export default ticketService;
```

### Service Entity Service

```javascript
// File: src/services/serviceService.js
import client from '../api/client';

const serviceService = {
  createService: async (serviceData) => {
    return client.post('/services', {
      name: serviceData.name,
      description: serviceData.description,
      averageDuration: serviceData.averageDuration,
      active: serviceData.active
    });
  },

  getAllServices: async () => {
    return client.get('/services');
  },

  getServiceById: async (id) => {
    return client.get(`/services/${id}`);
  },

  deleteService: async (id) => {
    return client.delete(`/services/${id}`);
  }
};

export default serviceService;
```

### Appointment Service

```javascript
// File: src/services/appointmentService.js
import client from '../api/client';

const appointmentService = {
  createAppointment: async (appointmentData) => {
    return client.post('/appointments', {
      appointmentDate: appointmentData.appointmentDate,
      status: appointmentData.status,
      notes: appointmentData.notes,
      user: { id: appointmentData.userId },
      service: { id: appointmentData.serviceId }
    });
  },

  getAllAppointments: async () => {
    return client.get('/appointments');
  },

  cancelAppointment: async (appointmentId) => {
    return client.delete(`/appointments/${appointmentId}`);
  }
};

export default appointmentService;
```

### Notification Service

```javascript
// File: src/services/notificationService.js
import client from '../api/client';

const notificationService = {
  getUserNotifications: async (userId) => {
    return client.get(`/notifications/${userId}`);
  },

  createNotification: async (notificationData) => {
    return client.post('/notifications', {
      message: notificationData.message,
      type: notificationData.type,
      user: { id: notificationData.userId }
    });
  }
};

export default notificationService;
```

---

## Component Integration

### Login Page Component

```jsx
// File: src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login to SmartQueue</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
```

### Register Page Component

```jsx
// File: src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Create Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
```

### Ticket Page Component

```jsx
// File: src/pages/TicketPage.jsx
import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import serviceService from '../services/serviceService';

const TicketPage = ({ userId }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchTickets();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await serviceService.getAllServices();
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleCreateTicket = async () => {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    setLoading(true);
    try {
      const ticket = await ticketService.createTicket(userId, selectedService);
      setTickets([...tickets, ticket.data]);
      setSelectedService(null);
      alert(`Ticket created: ${ticket.data.number}`);
    } catch (err) {
      console.error('Error creating ticket:', err);
      alert('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticket-page">
      <h2>Ticket Management</h2>
      
      <div className="create-ticket-section">
        <h3>Create New Ticket</h3>
        <select 
          value={selectedService || ''} 
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Select a service...</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateTicket} disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>

      <div className="tickets-section">
        <h3>My Tickets</h3>
        <div className="tickets-list">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-number">{ticket.number}</div>
              <div className="ticket-status">{ticket.status}</div>
              <div className="ticket-service">{ticket.service?.name}</div>
              <div className="ticket-created">{new Date(ticket.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
```

### Agent Page Component (Call/Complete Tickets)

```jsx
// File: src/pages/AgentPage.jsx
import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';

const AgentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  const handleCallNext = async () => {
    setLoading(true);
    try {
      const response = await ticketService.callNextTicket();
      setCurrentTicket(response.data);
      alert(`Called: ${response.data.number}`);
      fetchTickets();
    } catch (err) {
      alert('No tickets waiting');
      console.error('Error calling next:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTicket = async () => {
    if (!currentTicket) {
      alert('No ticket to complete');
      return;
    }

    setLoading(true);
    try {
      await ticketService.completeTicket(currentTicket.id);
      alert(`Completed: ${currentTicket.number}`);
      setCurrentTicket(null);
      fetchTickets();
    } catch (err) {
      console.error('Error completing ticket:', err);
      alert('Failed to complete ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-page">
      <h2>Queue Management</h2>
      
      <div className="agent-controls">
        <button onClick={handleCallNext} disabled={loading}>
          {loading ? 'Loading...' : 'Call Next Ticket'}
        </button>
      </div>

      {currentTicket && (
        <div className="current-ticket">
          <h3>Current Ticket</h3>
          <div className="ticket-display">
            <div className="number">{currentTicket.number}</div>
            <div className="status">{currentTicket.status}</div>
            <button onClick={handleCompleteTicket} disabled={loading}>
              Mark Complete
            </button>
          </div>
        </div>
      )}

      <div className="waiting-tickets">
        <h3>Waiting Tickets ({tickets.filter(t => t.status === 'WAITING').length})</h3>
        <div className="queue-list">
          {tickets
            .filter(t => t.status === 'WAITING')
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((ticket, index) => (
              <div key={ticket.id} className="queue-item">
                <span className="position">#{index + 1}</span>
                <span className="number">{ticket.number}</span>
                <span className="service">{ticket.service?.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
```

---

## WebSocket Setup

### WebSocket Hook

```javascript
// File: src/hooks/useTicketSocket.js
import { useEffect, useCallback } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const useTicketSocket = (onTicketUpdate) => {
  useEffect(() => {
    // Create WebSocket connection
    const socket = new SockJS('http://localhost:8080/ws-queue');
    const stompClient = Stomp.over(socket);

    // Connect to WebSocket
    stompClient.connect(
      {},
      () => {
        console.log('WebSocket Connected');
        
        // Subscribe to ticket updates
        stompClient.subscribe('/topic/tickets', (message) => {
          const ticketUpdate = JSON.parse(message.body);
          console.log('Ticket Update:', ticketUpdate);
          
          // Call the callback with updated ticket data
          if (onTicketUpdate) {
            onTicketUpdate(ticketUpdate);
          }
        });
      },
      (error) => {
        console.error('WebSocket Connection Error:', error);
      }
    );

    // Cleanup on unmount
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket Disconnected');
        });
      }
    };
  }, [onTicketUpdate]);
};

export default useTicketSocket;
```

### Using WebSocket in Component

```jsx
// File: src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import useTicketSocket from '../hooks/useTicketSocket';
import ticketService from '../services/ticketService';

const DashboardPage = () => {
  const [tickets, setTickets] = useState([]);

  // Handle real-time ticket updates
  const handleTicketUpdate = (ticketUpdate) => {
    setTickets(prevTickets => {
      const updatedTickets = prevTickets.map(t =>
        t.id === ticketUpdate.ticketId
          ? {
              ...t,
              status: ticketUpdate.status,
              number: ticketUpdate.number
            }
          : t
      );
      
      // Add new ticket if not already in list
      if (!updatedTickets.find(t => t.id === ticketUpdate.ticketId)) {
        updatedTickets.push(ticketUpdate);
      }
      
      return updatedTickets;
    });
  };

  // Connect to WebSocket
  useTicketSocket(handleTicketUpdate);

  // Fetch initial tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  return (
    <div className="dashboard">
      <h1>SmartQueue Dashboard</h1>
      
      <div className="tickets-overview">
        <h2>Queue Status</h2>
        <div className="status-summary">
          <div className="status-card">
            <span>Waiting: </span>
            <span className="count">{tickets.filter(t => t.status === 'WAITING').length}</span>
          </div>
          <div className="status-card">
            <span>Called: </span>
            <span className="count">{tickets.filter(t => t.status === 'CALLED').length}</span>
          </div>
          <div className="status-card">
            <span>Completed: </span>
            <span className="count">{tickets.filter(t => t.status === 'COMPLETED').length}</span>
          </div>
        </div>
      </div>

      <div className="tickets-feed">
        <h3>Live Ticket Updates</h3>
        {tickets.map(ticket => (
          <div key={ticket.id} className={`ticket-feed-item status-${ticket.status.toLowerCase()}`}>
            <div className="ticket-number">{ticket.number}</div>
            <div className="ticket-status">{ticket.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
```

---

## Data Management

### State Context for Auth

```jsx
// File: src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error loading profile:', err);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    await loadUserProfile();
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    await loadUserProfile();
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protected Route Component

```jsx
// File: src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## Frontend Feature Checklist

### Core Features to Implement

- [ ] User authentication (login/register)
- [ ] Ticket creation for users
- [ ] Ticket status display
- [ ] Queue viewing (WAITING tickets)
- [ ] Agent interface (call next/complete)
- [ ] Real-time ticket updates via WebSocket
- [ ] Service management
- [ ] Appointment booking
- [ ] Notifications display
- [ ] User profile management
- [ ] Role-based navigation

### Admin Features

- [ ] User management
- [ ] Service CRUD operations
- [ ] Health check dashboard
- [ ] System statistics

### Agent Features

- [ ] Call next ticket
- [ ] Complete ticket
- [ ] View current queue
- [ ] Ticket history

---

## Styling Recommendations

```scss
// Common ticket status colors
.status-waiting {
  background-color: #fff3cd; // Yellow
  color: #856404;
}

.status-called {
  background-color: #d1ecf1; // Blue
  color: #0c5460;
}

.status-completed {
  background-color: #d4edda; // Green
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da; // Red
  color: #721c24;
}
```

---

## Deployment Considerations

1. **API URL**: Update `API_URL` based on environment (dev/prod)
2. **WebSocket URL**: Ensure WebSocket endpoint is accessible
3. **CORS**: Backend CORS allows frontend origins
4. **Token Storage**: Use secure storage for JWT tokens
5. **Error Handling**: Implement comprehensive error handling
6. **Loading States**: Show loading indicators during API calls

---

**Generated:** May 13, 2026  
**Version:** 1.0

