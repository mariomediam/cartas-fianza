import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase() || 'U';
  };

  const infoCards = [
    {
      icon: '📋',
      title: 'Cartas Fianza',
      description: 'Gestiona todas las cartas fianza del sistema',
      color: 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400',
    },
    {
      icon: '🏦',
      title: 'Entidades Financieras',
      description: 'Administra las entidades financieras',
      color: 'from-green-50 to-green-100 border-green-200 hover:border-green-400',
    },
    {
      icon: '👥',
      title: 'Contratistas',
      description: 'Gestiona la información de contratistas',
      color: 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400',
    },
    {
      icon: '📊',
      title: 'Reportes',
      description: 'Genera reportes y estadísticas',
      color: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Título */}
            <div>
              <h1 className="text-2xl font-bold text-primary-500">
                Sistema de Gestión de Cartas Fianza
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Universidad Nacional de Frontera - Sullana
              </p>
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center gap-4">
              {/* Info usuario */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 
                              flex items-center justify-center text-white font-semibold text-base">
                  {getUserInitial()}
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {getUserDisplayName()}
                  </span>
                  <span className="text-xs text-gray-600">{user?.email}</span>
                </div>
              </div>

              {/* Botón logout */}
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-dark text-white text-sm font-medium rounded-md
                         hover:bg-dark-400 hover:-translate-y-0.5 hover:shadow-md
                         active:translate-y-0
                         transition-all duration-300"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido al Sistema!
          </h2>
          <p className="text-gray-600 text-base mb-8">
            Has iniciado sesión correctamente. El desarrollo del dashboard está en progreso.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoCards.map((card, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.color} 
                          rounded-lg p-6 text-center border-2 
                          transform hover:-translate-y-1 hover:shadow-lg
                          transition-all duration-300 cursor-pointer`}
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-semibold text-primary-500 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Estado del Sistema
          </h3>
          
          <div className="flex flex-col gap-4">
            {[
              '✅ Autenticación funcionando correctamente',
              '✅ Conectado al Backend Django',
              '✅ Base de datos PostgreSQL activa',
            ].map((status, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-md bg-green-50 text-green-800"
              >
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span className="text-sm font-medium">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
