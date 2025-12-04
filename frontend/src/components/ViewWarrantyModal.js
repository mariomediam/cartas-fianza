import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import { PDFIcon } from './icons';

const ViewWarrantyModal = ({ isOpen, onClose, warrantyHistoryId, onDeleted }) => {
  const navigate = useNavigate();
  
  // Estados
  const [warrantyData, setWarrantyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLatest, setIsLatest] = useState(false);
  const [checkingLatest, setCheckingLatest] = useState(false);
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Verificar si este historial es el último de su garantía
  const checkIfLatest = useCallback(async () => {
    if (!warrantyHistoryId) return;
    setCheckingLatest(true);
    try {
      const response = await api.get(`/warranty-histories/${warrantyHistoryId}/is-latest/`);
      setIsLatest(response.data.is_latest);
    } catch (error) {
      console.error('Error al verificar si es el último historial:', error);
      setIsLatest(false);
    } finally {
      setCheckingLatest(false);
    }
  }, [warrantyHistoryId]);
  
  // Cargar datos del historial
  const loadWarrantyHistory = useCallback(async () => {
    if (!warrantyHistoryId) return;
    setLoading(true);
    try {
      const response = await api.get(`/warranty-histories/${warrantyHistoryId}/`);
      setWarrantyData(response.data);
      await checkIfLatest();
    } catch (error) {
      console.error('Error al cargar el historial:', error);
      toast.error('Error al cargar la información de la carta');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [warrantyHistoryId, checkIfLatest, onClose]);
  
  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen && warrantyHistoryId) {
      loadWarrantyHistory();
    }
  }, [isOpen, warrantyHistoryId, loadWarrantyHistory]);
  
  // Limpiar datos al cerrar
  useEffect(() => {
    if (!isOpen) {
      setWarrantyData(null);
      setShowDeleteModal(false);
    }
  }, [isOpen]);
  
  // Formatear número con separador de miles y decimales
  const formatAmount = (amount) => {
    if (!amount) return '0.00';
    return parseFloat(amount).toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  // Manejar descarga de archivo
  const handleDownloadFile = (fileUrl, fileName) => {
    window.open(fileUrl, '_blank');
  };
  
  // Manejar modificación
  const handleModificar = () => {
    toast.info('Función Modificar en desarrollo');
    // onClose();
    // navigate(`/cartas-fianza/editar/${warrantyHistoryId}`);
  };
  
  // Manejar eliminación - mostrar modal de confirmación
  const handleEliminar = () => {
    setShowDeleteModal(true);
  };
  
  // Confirmar eliminación
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await api.delete(`/warranty-histories/${warrantyHistoryId}/eliminar/`);
      
      setShowDeleteModal(false);
      
      if (response.data.deleted?.warranty_deleted) {
        toast.success('Historial y garantía eliminados correctamente');
      } else {
        toast.success('Historial eliminado correctamente');
      }
      
      // Cerrar el modal y notificar al padre para refrescar
      onClose();
      if (onDeleted) {
        onDeleted();
      }
      
    } catch (error) {
      console.error('Error al eliminar:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error al eliminar el historial');
      }
    } finally {
      setDeleting(false);
    }
  };
  
  // Cancelar eliminación
  const cancelDelete = () => {
    setShowDeleteModal(false);
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
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all">
          
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ver carta</h2>
              {warrantyData?.warranty_object_description && (
                <p className="text-gray-600 text-sm mt-1">{warrantyData.warranty_object_description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  <p className="text-gray-600">Cargando información...</p>
                </div>
              </div>
            ) : warrantyData ? (
              <div className="space-y-6">
                {/* Fila 1: Tipo de carta y Número de carta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de carta
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.letter_type_description}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de carta
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.letter_number}
                    </div>
                  </div>
                </div>
                
                {/* Fila 2: Entidad financiera y Dirección */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entidad financiera emisora
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.financial_entity_description}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de la entidad
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.financial_entity_address}
                    </div>
                  </div>
                </div>
                
                {/* Fila 3: Fecha de emisión, Inicio de vigencia, Fin de vigencia */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de emisión
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.issue_date}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inicio de vigencia
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.validity_start}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fin de vigencia
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.validity_end}
                    </div>
                  </div>
                </div>
                
                {/* Fila 4: Moneda e Importe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Moneda
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {warrantyData.currency_type_description} ({warrantyData.currency_type_symbol})
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importe
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium">
                      {warrantyData.currency_type_symbol} {formatAmount(warrantyData.amount)}
                    </div>
                  </div>
                </div>
                
                {/* Fila 5: Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documento
                  </label>
                  <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {warrantyData.reference_document || '-'}
                  </div>
                </div>
                
                {/* Fila 6: Contratista */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contratista
                  </label>
                  <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                    {warrantyData.contractor_ruc} - {warrantyData.contractor_business_name}
                  </div>
                </div>
                
                {/* Fila 7: Observaciones */}
                {warrantyData.comments && warrantyData.comments.trim() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 whitespace-pre-wrap">
                      {warrantyData.comments}
                    </div>
                  </div>
                )}
                
                {/* Fila 8: Documentos digitales */}
                {warrantyData.files && warrantyData.files.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documentos digitales
                    </label>
                    <div className="space-y-2">
                      {warrantyData.files.map((file) => (
                        <div 
                          key={file.id} 
                          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <PDFIcon size={24} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Subido por {file.created_by_name} el {file.created_at}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(file.file_url || file.file, file.file_name)}
                            className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mensaje si no es el último historial */}
                {!isLatest && !checkingLatest && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Este NO es el último historial de la garantía. Solo se puede modificar o eliminar el historial más reciente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          
          {/* Footer con botones de acción */}
          {warrantyData && isLatest && (
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={handleEliminar}
                className="w-full sm:w-auto px-6 py-2.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
              <button
                type="button"
                onClick={handleModificar}
                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modificar
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={cancelDelete}
          ></div>
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                ¿Eliminar este historial?
              </h3>
              
              <p className="text-sm text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. Se eliminarán el historial y todos los archivos asociados.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium text-gray-700">Número de carta:</span> {warrantyData?.letter_number}</p>
                  <p><span className="font-medium text-gray-700">Estado:</span> {warrantyData?.warranty_status_description}</p>
                  <p><span className="font-medium text-gray-700">Fecha emisión:</span> {warrantyData?.issue_date}</p>
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Sí, eliminar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewWarrantyModal;

