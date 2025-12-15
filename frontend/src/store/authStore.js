import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado
      user: null,
      token: null,
      loading: false,

      // Acciones
      login: async (username, password) => {
        set({ loading: true });
        try {
          const data = await authService.login(username, password);
          
          const userData = {
            user_id: data.user_id,
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            can_manage_users: data.can_manage_users || false,
          };

          set({
            token: data.token,
            user: userData,
            loading: false,
          });

          return { success: true, data };
        } catch (error) {
          set({ loading: false });
          const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        } finally {
          set({ token: null, user: null });
        }
      },

      isAuthenticated: () => {
        const { token, user } = get();
        return !!token && !!user;
      },

      // Limpiar estado (útil para testing o reset)
      clearAuth: () => {
        set({ token: null, user: null, loading: false });
      },
    }),
    {
      name: 'auth-storage', // nombre en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;

