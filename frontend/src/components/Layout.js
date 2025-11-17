import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';

const Layout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCatalogosMenu, setShowCatalogosMenu] = useState(false);
  const [showReportesMenu, setShowReportesMenu] = useState(false);
  const userMenuRef = useRef(null);
  const catalogosMenuRef = useRef(null);
  const reportesMenuRef = useRef(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (catalogosMenuRef.current && !catalogosMenuRef.current.contains(event.target)) {
        setShowCatalogosMenu(false);
      }
      if (reportesMenuRef.current && !reportesMenuRef.current.contains(event.target)) {
        setShowReportesMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
    navigate('/login');
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'US';
  };

  const getUserFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'Usuario';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: 'Inicio', path: '/dashboard', icon: '🏠' },
    { 
      name: 'Catálogos', 
      path: '#',
      icon: '📚',
      hasSubmenu: true,
      submenu: [
        { name: 'Objetos de Garantía', path: '/catalogos/objetos-garantia' },
        { name: 'Tipos de Carta', path: '/catalogos/tipos-carta' },
        { name: 'Entidades Financieras', path: '/catalogos/entidades-financieras' },
        { name: 'Contratistas', path: '/catalogos/contratistas' },
        { name: 'Estados de Garantía', path: '/catalogos/estados-garantia' },
        { name: 'Tipos de Moneda', path: '/catalogos/tipos-moneda' },
      ]
    },
    { name: 'Cartas fianza', path: '/cartas-fianza', icon: '📋' },
    { 
      name: 'Reportes', 
      path: '#',
      icon: '📊',
      hasSubmenu: true,
      submenu: [
        { name: 'Reporte General', path: '/reportes/general' },
        { name: 'Cartas Vencidas', path: '/reportes/vencidas' },
        { name: 'Cartas por Vencer', path: '/reportes/por-vencer' },
        { name: 'Por Entidad Financiera', path: '/reportes/por-entidad' },
        { name: 'Por Contratista', path: '/reportes/por-contratista' },
      ]
    },
    { name: 'Usuarios', path: '/usuarios', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <img 
                src={`${process.env.PUBLIC_URL}/images/logo-unf.png`}
                alt="Logo UNF"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="hidden md:block">
                <h1 className="text-white font-bold text-lg leading-tight">
                  SISTEMA DE GESTIÓN DE CARTAS FIANZA
                </h1>
                <p className="text-primary-100 text-xs">
                  Universidad Nacional de Frontera
                </p>
              </div>
            </div>

            {/* Menú de navegación */}
            <div className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <div key={item.name} className="relative" ref={item.name === 'Catálogos' ? catalogosMenuRef : item.name === 'Reportes' ? reportesMenuRef : null}>
                  {item.hasSubmenu ? (
                    <>
                      <button
                        onClick={() => {
                          if (item.name === 'Catálogos') {
                            setShowCatalogosMenu(!showCatalogosMenu);
                            setShowReportesMenu(false);
                          } else if (item.name === 'Reportes') {
                            setShowReportesMenu(!showReportesMenu);
                            setShowCatalogosMenu(false);
                          }
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2
                          ${isActive(item.path)
                            ? 'bg-primary-800 text-white'
                            : 'text-primary-50 hover:bg-primary-500 hover:text-white'
                          }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Submenu dropdown */}
                      {((item.name === 'Catálogos' && showCatalogosMenu) || 
                        (item.name === 'Reportes' && showReportesMenu)) && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem.name}
                              onClick={() => {
                                navigate(subItem.path);
                                setShowCatalogosMenu(false);
                                setShowReportesMenu(false);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                                ${isActive(subItem.path)
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(item.path)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2
                        ${isActive(item.path)
                          ? 'bg-primary-800 text-white'
                          : 'text-primary-50 hover:bg-primary-500 hover:text-white'
                        }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Avatar del usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-primary-500 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 
                              flex items-center justify-center text-white font-bold text-sm
                              ring-2 ring-white shadow-lg">
                  {getUserInitials()}
                </div>
              </button>

              {/* Dropdown del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {getUserFullName()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {user?.email || user?.username}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 
                             transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="lg:hidden border-t border-primary-500">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => !item.hasSubmenu && navigate(item.path)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2
                    ${isActive(item.path)
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-50 hover:bg-primary-500 hover:text-white'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
                {item.hasSubmenu && item.submenu && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.name}
                        onClick={() => navigate(subItem.path)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs
                          ${isActive(subItem.path)
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-100 hover:bg-primary-500'
                          }`}
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2025 Universidad Nacional de Frontera - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

