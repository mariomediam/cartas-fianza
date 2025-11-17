import axios from 'axios';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    // Leer el token del storage de Zustand
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Token ${state.token}`;
        }
      } catch (error) {
        console.error('Error al parsear auth-storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir si hay un 401 Y no estamos en la ruta de login
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login/')) {
      // Si el token es inválido (usuario ya logueado), limpiar y redirigir
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout/');
      return response.data;
    } finally {
      // Limpiar el storage de Zustand
      localStorage.removeItem('auth-storage');
    }
  },

  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// Exportar la instancia de axios configurada para otros servicios
export default api;

