import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import Layout from '../components/Layout';
import { PDFIcon } from '../components/icons';

const EditEjecucion = () => {
  const navigate = useNavigate();
  const { warrantyHistoryId } = useParams();
  
  // Estado para los datos originales
  const [originalData, setOriginalData] = useState(null);
  const [previousHistory, setPreviousHistory] = useState(null);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    issue_date: '',
    reference_document: '',
    comments: '',
  });
  
  // Estados para archivos
  const [existingFiles, setExistingFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadInitialData();
  }, [warrantyHistoryId]);
  
  // Función para convertir fecha DD/MM/YYYY a YYYY-MM-DD
  const convertDateToInput = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('-') && dateStr.length === 10) {
      return dateStr;
    }
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  };
  
  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      // Cargar datos del historial de ejecución
      const historyRes = await api.get(`/warranty-histories/${warrantyHistoryId}/`);
      const historyData = historyRes.data;
      setOriginalData(historyData);
      
      // Cargar el historial previo (la carta activa antes de la ejecución)
      const warrantyRes = await api.get(`/warranties/${historyData.warranty_id}/`);
      const warranty = warrantyRes.data;
      
      if (warranty.history && warranty.history.length > 1) {
        // Buscar el historial previo al de ejecución
        const sortedHistory = [...warranty.history].sort((a, b) => b.id - a.id);
        const currentIndex = sortedHistory.findIndex(h => h.id === parseInt(warrantyHistoryId));
        if (currentIndex >= 0 && currentIndex < sortedHistory.length - 1) {
          const prevHistory = sortedHistory[currentIndex + 1];
          setPreviousHistory({
            letter_type_description: warranty.letter_type_description,
            letter_number: prevHistory.letter_number,
            financial_entity_description: prevHistory.financial_entity_description,
            financial_entity_address: prevHistory.financial_entity_address,
            issue_date: prevHistory.issue_date,
            validity_start: prevHistory.validity_start,
            validity_end: prevHistory.validity_end,
            contractor_ruc: warranty.contractor_ruc,
            contractor_business_name: warranty.contractor_business_name,
            currency_type_description: prevHistory.currency_type_description,
            currency_type_symbol: prevHistory.currency_type_symbol,
            amount: prevHistory.amount,
          });
        }
      }
      
      // Setear los datos del formulario
      setFormData({
        issue_date: convertDateToInput(historyData.issue_date) || '',
        reference_document: historyData.reference_document || '',
        comments: historyData.comments || '',
      });
      
      // Setear archivos existentes
      setExistingFiles(historyData.files || []);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar la información de la ejecución');
      navigate(-1);
    } finally {
      setLoadingData(false);
    }
  };
  
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
  
  // Manejar cambio de archivos nuevos
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast.warning('Solo se permiten archivos PDF');
    }
    
    setNewFiles(prev => [...prev, ...pdfFiles]);
  };
  
  // Eliminar un archivo nuevo de la lista
  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Marcar/desmarcar archivo existente para eliminar
  const toggleDeleteExistingFile = (fileId) => {
    setFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  };
  
  // Cancelar y regresar
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Descargar archivo existente
  const handleDownloadFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };
  
  // Validar formulario
  const validateForm = () => {
    if (!formData.issue_date) {
      toast.error('Debe ingresar la fecha de ejecución');
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
      const formDataToSend = new FormData();
      
      // Agregar campos del formulario
      formDataToSend.append('issue_date', formData.issue_date);
      formDataToSend.append('reference_document', formData.reference_document.trim());
      formDataToSend.append('comments', formData.comments.trim());
      
      // Agregar archivos a eliminar
      if (filesToDelete.length > 0) {
        formDataToSend.append('files_to_delete', JSON.stringify(filesToDelete));
      }
      
      // Agregar archivos nuevos
      newFiles.forEach(file => {
        formDataToSend.append('files', file);
      });
      
      // Enviar al backend
      await api.post(`/warranty-histories/${warrantyHistoryId}/modificar-ejecucion/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Ejecución modificada correctamente');
      navigate('/cartas-fianza', { state: { shouldRefresh: true } });
      
    } catch (error) {
      console.error('Error al modificar la ejecución:', error);
      
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
          toast.error('Error al modificar la ejecución');
        }
      } else {
        toast.error('Error al modificar la ejecución');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1 pr-12">
            <h1 className="text-2xl font-bold text-gray-900">Modificar ejecución</h1>
            {originalData?.warranty_object_description && (
              <p className="text-gray-600 mt-1 uppercase font-medium">{originalData.warranty_object_description}</p>
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
          
          {/* ===== SECCIÓN SOLO LECTURA - Datos del historial previo ===== */}
          {previousHistory && (
            <>
              {/* Fila 1: Tipo de carta y Número de carta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Tipo de carta
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.letter_type_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Número
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.letter_number}
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
                    {previousHistory.financial_entity_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Dirección de la entidad
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.financial_entity_address}
                  </div>
                </div>
              </div>
              
              {/* Fila 3: Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de emisión
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.issue_date}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Inicio de vigencia
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.validity_start}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fin de vigencia
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.validity_end}
                  </div>
                </div>
              </div>
              
              {/* Fila 4: Contratista */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Contratista
                </label>
                <div className="text-gray-900 font-medium">
                  {previousHistory.contractor_ruc} - {previousHistory.contractor_business_name}
                </div>
              </div>
              
              {/* Fila 5: Moneda e Importe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Moneda
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.currency_type_description}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Importe
                  </label>
                  <div className="text-gray-900 font-medium">
                    {previousHistory.currency_type_symbol} {formatAmount(previousHistory.amount)}
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
              <span className="bg-white pr-4 text-lg font-semibold text-red-700">
                Ejecución
              </span>
            </div>
          </div>
          
          {/* ===== SECCIÓN EDITABLE - Datos de la ejecución ===== */}
          
          {/* Fecha y Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="issue_date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="reference_document" className="block text-sm font-medium text-gray-700 mb-2">
                Documento
              </label>
              <input
                type="text"
                id="reference_document"
                name="reference_document"
                value={formData.reference_document}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Observaciones */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>
          
          {/* Archivos existentes */}
          {existingFiles.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos digitales existentes
              </label>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      filesToDelete.includes(file.id) 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <PDFIcon size={24} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${filesToDelete.includes(file.id) ? 'text-red-700 line-through' : 'text-gray-900'}`}>
                          {file.file_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Subido por {file.created_by_name} el {file.created_at}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(file.file_url || file.file)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleDeleteExistingFile(file.id)}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          filesToDelete.includes(file.id)
                            ? 'text-green-700 bg-green-50 hover:bg-green-100'
                            : 'text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {filesToDelete.includes(file.id) ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Restaurar
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filesToDelete.length > 0 && (
                <p className="mt-2 text-sm text-red-600">
                  {filesToDelete.length} archivo(s) marcado(s) para eliminar
                </p>
              )}
            </div>
          )}
          
          {/* Agregar nuevos archivos */}
          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
              Agregar nuevos documentos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  Suelte los archivos aquí o haz clic para subirlos
                </span>
                <span className="text-xs text-gray-400">Solo archivos PDF</span>
              </label>
            </div>
            
            {/* Lista de archivos nuevos */}
            {newFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Archivos nuevos a agregar ({newFiles.length}):
                </p>
                {newFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                      <span className="text-xs text-red-600 font-medium">NUEVO</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
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
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Guardar cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditEjecucion;





