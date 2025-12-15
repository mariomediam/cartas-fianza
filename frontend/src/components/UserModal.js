import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../services/api';

const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    is_active: true,
    can_manage_users: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      if (user) {
        // Modo edición
        setFormData({
          username: user.username || '',
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          password: '',
          password_confirm: '',
          is_active: user.is_active !== undefined ? user.is_active : true,
          can_manage_users: user.can_manage_users || false,
        });
      } else {
        // Modo creación
        setFormData({
          username: '',
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          password_confirm: '',
          is_active: true,
          can_manage_users: false,
        });
      }
      setErrors({});
      setShowPassword(false);
      setShowPasswordConfirm(false);
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }

    // Validar password solo si es creación o si se está intentando cambiar
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      
      if (!formData.password_confirm) {
        newErrors.password_confirm = 'Debe confirmar la contraseña';
      } else if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = 'Las contraseñas no coinciden';
      }
    } else {
      // En edición, solo validar si se proporciona contraseña
      if (formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (formData.password !== formData.password_confirm) {
          newErrors.password_confirm = 'Las contraseñas no coinciden';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        can_manage_users: formData.can_manage_users,
      };

      if (isEditing) {
        dataToSend.is_active = formData.is_active;
        
        // Solo enviar password si se proporcionó
        if (formData.password) {
          dataToSend.password = formData.password;
          dataToSend.password_confirm = formData.password_confirm;
        }
        
        await api.put(`/users/${user.id}/`, dataToSend);
        toast.success('Usuario actualizado correctamente');
      } else {
        dataToSend.password = formData.password;
        dataToSend.password_confirm = formData.password_confirm;
        
        await api.post('/users/', dataToSend);
        toast.success('Usuario creado correctamente');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      if (error.response?.data) {
        const serverErrors = error.response.data;
        
        // Mapear errores del servidor
        const mappedErrors = {};
        Object.keys(serverErrors).forEach(key => {
          if (Array.isArray(serverErrors[key])) {
            mappedErrors[key] = serverErrors[key][0];
          } else if (typeof serverErrors[key] === 'string') {
            mappedErrors[key] = serverErrors[key];
          }
        });
        
        if (Object.keys(mappedErrors).length > 0) {
          setErrors(mappedErrors);
        } else if (serverErrors.error) {
          toast.error(serverErrors.error);
        } else if (serverErrors.detail) {
          toast.error(serverErrors.detail);
        } else {
          toast.error('Error al guardar el usuario');
        }
      } else {
        toast.error('Error al guardar el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-140px)] p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-5">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isEditing}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  } ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="Nombre de usuario"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
                {isEditing && (
                  <p className="mt-1 text-xs text-gray-500">El nombre de usuario no se puede modificar</p>
                )}
              </div>

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Apellido"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.password_confirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Repetir contraseña'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="mt-1 text-sm text-red-500">{errors.password_confirm}</p>
                )}
              </div>

              {/* Permisos y Estado */}
              <div className="border-t border-gray-200 pt-4 sm:pt-5 space-y-3 sm:space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Permisos y Estado</h4>
                
                {/* Puede administrar usuarios */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <label className="text-sm font-medium text-gray-700">
                      Puede administrar usuarios
                    </label>
                    <p className="text-xs text-gray-500">
                      Permite acceder al módulo de usuarios
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      name="can_manage_users"
                      checked={formData.can_manage_users}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                {/* Usuario activo (solo en edición) */}
                {isEditing && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-gray-700">
                        Usuario activo
                      </label>
                      <p className="text-xs text-gray-500">
                        Permite al usuario iniciar sesión
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end mt-5 sm:mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>{isEditing ? 'Actualizar' : 'Crear'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;

