import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import Layout from '../components/Layout';

const ReturnWarranty = () => {
  const navigate = useNavigate();
  const { warrantyId } = useParams();
  const [searchParams] = useSearchParams();
  const warrantyObjectDescription = searchParams.get('description');
  
  // Estado para los datos del último historial (solo lectura)
  const [lastHistory, setLastHistory] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Estados del formulario (solo los campos necesarios para devolución)
  const [formData, setFormData] = useState({
    issue_date: '',
    reference_document: '',
    comments: '',
  });
  
  // Estados para archivos
  const [files, setFiles] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  
  // Cargar el último historial de la garantía
  const loadLastHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      // Obtener la garantía con su historial
      const response = await api.get(`/warranties/${warrantyId}/`);
      const warranty = response.data;
      
      // El último historial es el que tiene el ID más alto
      if (warranty.history && warranty.history.length > 0) {
        // Ordenar por ID descendente y tomar el primero
        const sortedHistory = [...warranty.history].sort((a, b) => b.id - a.id);
        const latest = sortedHistory[0];
        
        setLastHistory({
          letter_type_description: warranty.letter_type_description,
          letter_number: latest.letter_number,
          financial_entity_description: latest.financial_entity_description,
          financial_entity_address: latest.financial_entity_address,
          issue_date: latest.issue_date,
          validity_start: latest.validity_start,
          validity_end: latest.validity_end,
          contractor_ruc: warranty.contractor_ruc,
          contractor_business_name: warranty.contractor_business_name,
          currency_type_description: latest.currency_type_description,
          currency_type_symbol: latest.currency_type_symbol,
          amount: latest.amount,
        });
      }
    } catch (error) {
      console.error('Error al cargar el historial:', error);
      toast.error('Error al cargar la información de la carta');
    } finally {
      setLoadingHistory(false);
    }
  }, [warrantyId]);
  
  useEffect(() => {
    loadLastHistory();
  }, [loadLastHistory]);
  
  // Formatear número con separador de miles y decimales
  const formatAmount = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar cambio de archivos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validar que sean PDFs
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast.warning('Solo se permiten archivos PDF');
    }
    
    setFiles(pdfFiles);
  };
  
  // Eliminar un archivo de la lista
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Cancelar y regresar
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Validar formulario
  const validateForm = () => {
    if (!formData.issue_date) {
      toast.error('Debe ingresar la fecha de devolución');
      return false;
    }
    
    return true;
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Agregar campos del formulario
      formDataToSend.append('warranty_id', warrantyId);
      formDataToSend.append('issue_date', formData.issue_date);
      
      if (formData.reference_document.trim()) {
        formDataToSend.append('reference_document', formData.reference_document.trim());
      }
      
      if (formData.comments.trim()) {
        formDataToSend.append('comments', formData.comments.trim());
      }
      
      // Agregar archivos
      files.forEach(file => {
        formDataToSend.append('files', file);
      });
      
      // Enviar al backend
      await api.post('/warranty-histories/devolver/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Carta devuelta correctamente');
      
      // Regresar a la página anterior con flag para refrescar
      navigate('/cartas-fianza', { state: { shouldRefresh: true } });
      
    } catch (error) {
      console.error('Error al devolver la carta:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'object') {
          Object.keys(errors).forEach(key => {
            const errorMessages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
            errorMessages.forEach(msg => {
              toast.error(`${key}: ${msg}`);
            });
          });
        } else {
          toast.error('Error al devolver la carta');
        }
      } else {
        toast.error('Error al devolver la carta');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar loading mientras carga el historial
  if (loadingHistory) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Título con ícono y botón cerrar */}
        <div className="relative flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 pr-12">
            <h1 className="text-2xl font-bold text-gray-900">Devolver carta</h1>
            {warrantyObjectDescription && (
              <p className="text-gray-600 mt-1 uppercase font-medium">{warrantyObjectDescription}</p>
            )}
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={handleCancel}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Cerrar y volver"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          
          {/* ===== SECCIÓN SOLO LECTURA - Datos del último historial ===== */}
          {lastHistory && (
            <>
              {/* Fila 1: Tipo de carta y Número de carta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tipo de carta
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.letter_type_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Número
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.letter_number}
                  </div>
                </div>
              </div>
              
              {/* Fila 2: Entidad financiera y Dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Entidad financiera emisora
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.financial_entity_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Dirección de la entidad
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.financial_entity_address}
                  </div>
                </div>
              </div>
              
              {/* Fila 3: Fecha de emisión, Inicio de vigencia, Fin de vigencia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de emisión
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.issue_date}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Inicio de vigencia
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.validity_start}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fin de vigencia
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.validity_end}
                  </div>
                </div>
              </div>
              
              {/* Fila 4: Contratista (toda la fila) */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Contratista
                </label>
                <div className="text-gray-900 font-medium">
                  {lastHistory.contractor_ruc} - {lastHistory.contractor_business_name}
                </div>
              </div>
              
              {/* Fila 5: Moneda e Importe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Moneda
                  </label>
                  <div className="text-gray-900 font-medium">
                    {lastHistory.currency_type_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Importe
                  </label>
                  <div className="text-gray-900 font-medium">
                    {formatAmount(lastHistory.amount)}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* ===== LÍNEA DIVISORA CON TÍTULO ===== */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="bg-white pr-4 text-lg font-semibold text-gray-700">
                Devolución
              </span>
            </div>
          </div>
          
          {/* ===== SECCIÓN EDITABLE - Datos de la devolución ===== */}
          
          {/* Fila 6: Fecha y Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-500 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="issue_date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="reference_document" className="block text-sm font-medium text-gray-500 mb-1">
                Documento
              </label>
              <input
                type="text"
                id="reference_document"
                name="reference_document"
                value={formData.reference_document}
                onChange={handleInputChange}
                placeholder=""
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Fila 7: Observaciones (toda la fila) */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-500 mb-1">
              Observaciones
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white"
              disabled={loading}
            />
          </div>
          
          {/* Fila 8: Documentos digitales */}
          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-500 mb-1">
              Documentos digitales
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
              <input
                type="file"
                id="files"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <label 
                htmlFor="files" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  Suelte los archivos aquí o has clic para subirlos
                </span>
              </label>
            </div>
            
            {/* Lista de archivos seleccionados */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Archivos seleccionados ({files.length}):
                </p>
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Grabar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ReturnWarranty;
