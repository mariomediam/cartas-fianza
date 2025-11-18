import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../services/api';

/**
 * Modal reutilizable para crear/editar Contratistas
 * 
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Función a ejecutar al cerrar el modal
 * @param {function} onSuccess - Función a ejecutar después de crear/editar exitosamente
 * @param {object} contractor - Objeto contratista para editar (null para crear nuevo)
 * @param {string} title - Título personalizado del modal (opcional)
 */
const ContractorModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  contractor = null,
  title = null 
}) => {
  const [formData, setFormData] = useState({
    business_name: '',
    ruc: '',
  });
  const [loading, setLoading] = useState(false);

  // Cargar datos del contratista cuando se abre para editar
  useEffect(() => {
    if (isOpen && contractor) {
      setFormData({
        business_name: contractor.business_name || '',
        ruc: contractor.ruc || '',
      });
    } else if (isOpen && !contractor) {
      // Limpiar formulario para nuevo contratista
      setFormData({
        business_name: '',
        ruc: '',
      });
    }
  }, [isOpen, contractor]);

  const handleClose = () => {
    setFormData({
      business_name: '',
      ruc: '',
    });
    onClose();
  };

  const validateRuc = (ruc) => {
    // Validar que sea solo números
    if (!/^\d+$/.test(ruc)) {
      return 'El RUC debe contener solo números';
    }
    // Validar que tenga exactamente 11 dígitos
    if (ruc.length !== 11) {
      return 'El RUC debe tener exactamente 11 dígitos';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.business_name.trim()) {
      toast.error('La razón social es obligatoria');
      return;
    }

    if (!formData.ruc.trim()) {
      toast.error('El RUC es obligatorio');
      return;
    }

    // Validar RUC
    const rucError = validateRuc(formData.ruc.trim());
    if (rucError) {
      toast.error(rucError);
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        business_name: formData.business_name.trim(),
        ruc: formData.ruc.trim()
      };

      if (contractor) {
        // Actualizar
        await api.put(`/contractors/${contractor.id}/`, dataToSend);
        toast.success('Contratista actualizado correctamente');
      } else {
        // Crear
        await api.post('/contractors/', dataToSend);
        toast.success('Contratista creado correctamente');
      }
      
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar contratista:', error);
      if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach(key => {
          if (Array.isArray(errors[key])) {
            errors[key].forEach(msg => toast.error(`${key}: ${msg}`));
          } else {
            toast.error(`${key}: ${errors[key]}`);
          }
        });
      } else {
        toast.error('Error al guardar el contratista');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRucChange = (e) => {
    // Permitir solo números y limitar a 11 dígitos
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setFormData({ ...formData, ruc: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {title || (contractor ? 'Editar Contratista' : 'Agregar Contratista')}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del modal */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Razón Social */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">
                Razón Social / Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                placeholder="Ej: CONSTRUCTORA ABC S.A.C."
                maxLength={255}
                required
                disabled={loading}
              />
            </div>

            {/* RUC */}
            <div>
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">
                RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ruc"
                value={formData.ruc}
                onChange={handleRucChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400"
                placeholder="Ej: 20123456789"
                maxLength={11}
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Registro Único de Contribuyentes (11 dígitos)
              </p>
            </div>
          </div>

          {/* Botones del modal */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{contractor ? 'Actualizar' : 'Guardar'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractorModal;

