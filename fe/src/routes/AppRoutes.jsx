/**
 * AppRoutes - Centralized route configuration
 * 
 * This file provides a modular way to organize and manage application routes.
 * Currently, routes are defined inline in App.js for simplicity, but this file
 * can be used to extract and organize routes as the application grows.
 */

// Route definitions can be exported from here for better organization
export const publicRoutes = [
  { path: '/', label: 'Accueil' },
  { path: '/login', label: 'Connexion' },
  { path: '/register', label: 'Inscription' },
];

export const protectedRoutes = [
  { path: '/dashboard', label: 'Tableau de bord', roles: [] },
  { path: '/queue', label: 'File d\'attente', roles: [] },
  { path: '/appointments', label: 'Rendez-vous', roles: ['USER', 'ADMIN'] },
  { path: '/notifications', label: 'Notifications', roles: [] },
  { path: '/services', label: 'Services', roles: [] },
];

export const adminRoutes = [
  { path: '/agent', label: 'Guichet', roles: ['ADMIN', 'AGENT'] },
  { path: '/users', label: 'Gestion des usagers', roles: ['ADMIN'] },
  { path: '/admin', label: 'Administration', roles: ['ADMIN'] },
];

export const allRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes];

// Helper to get route by path
export const getRouteByPath = (path) => {
  return allRoutes.find((r) => r.path === path);
};

// Helper to check if user has access to route
export const canAccessRoute = (route, userRole) => {
  if (!route.roles || route.roles.length === 0) return true;
  return route.roles.includes(userRole);
};

export default {
  publicRoutes,
  protectedRoutes,
  adminRoutes,
  allRoutes,
  getRouteByPath,
  canAccessRoute,
};
