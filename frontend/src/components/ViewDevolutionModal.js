import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import { PDFIcon } from './icons';

const ViewDevolutionModal = ({ isOpen, onClose, warrantyHistoryId, onDeleted }) => {
  const navigate = useNavigate();
  // Estados
  const [devolutionData, setDevolutionData] = useState(null);
  const [previousHistory, setPreviousHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLatest, setIsLatest] = useState(false);
  
  // Estados para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Cargar datos de la devolución y el historial anterior
  const loadDevolutionData = useCallback(async () => {
    if (!warrantyHistoryId) return;
    setLoading(true);
    try {
      // Cargar el historial de devolución
      const response = await api.get(`/warranty-histories/${warrantyHistoryId}/`);
      const devolution = response.data;
      setDevolutionData(devolution);
      
      // Verificar si es el último historial
      const latestResponse = await api.get(`/warranty-histories/${warrantyHistoryId}/is-latest/`);
      setIsLatest(latestResponse.data.is_latest);
      
      // Cargar la garantía completa para obtener el historial anterior
      const warrantyResponse = await api.get(`/warranties/${devolution.warranty_id}/`);
      const warranty = warrantyResponse.data;
      
      // Buscar el historial anterior a la devolución
      if (warranty.history && warranty.history.length > 1) {
        const sortedHistory = [...warranty.history].sort((a, b) => b.id - a.id);
        const previous = sortedHistory.find(h => h.id < devolution.id && h.warranty_status_is_active);
        
        if (previous) {
          setPreviousHistory({
            letter_type_description: warranty.letter_type_description,
            letter_number: previous.letter_number,
            financial_entity_description: previous.financial_entity_description,
            financial_entity_address: previous.financial_entity_address,
            issue_date: previous.issue_date,
            validity_start: previous.validity_start,
            validity_end: previous.validity_end,
            contractor_ruc: warranty.contractor_ruc,
            contractor_business_name: warranty.contractor_business_name,
            currency_type_description: previous.currency_type_description,
            currency_type_symbol: previous.currency_type_symbol,
            amount: previous.amount,
          });
        }
      }
      
    } catch (error) {
      console.error('Error al cargar la devolución:', error);
      toast.error('Error al cargar la información');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [warrantyHistoryId, onClose]);
  
  useEffect(() => {
    if (isOpen && warrantyHistoryId) {
      loadDevolutionData();
    }
  }, [isOpen, warrantyHistoryId, loadDevolutionData]);
  
  // Limpiar datos al cerrar
  useEffect(() => {
    if (!isOpen) {
      setDevolutionData(null);
      setPreviousHistory(null);
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
    onClose();
    navigate(`/cartas-fianza/editar-devolucion/${warrantyHistoryId}`);
  };
  
  // Manejar eliminación
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
        toast.success('Devolución y garantía eliminadas correctamente');
      } else {
        toast.success('Devolución eliminada correctamente');
      }
      
      onClose();
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error al eliminar la devolución');
      }
    } finally {
      setDeleting(false);
    }
  };
  
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
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ver devolución</h2>
                {devolutionData?.warranty_object_description && (
                  <p className="text-gray-600 text-sm uppercase font-medium">{devolutionData.warranty_object_description}</p>
                )}
              </div>
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
            ) : devolutionData ? (
              <div className="space-y-6">
                {/* SECCIÓN SOLO LECTURA - Datos del historial anterior */}
                {previousHistory && (
                  <>
                    {/* Fila 1: Tipo de carta y Número */}
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
                          {formatAmount(previousHistory.amount)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {/* LÍNEA DIVISORA CON TÍTULO */}
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
                
                {/* SECCIÓN DE DEVOLUCIÓN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Fecha
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {devolutionData.issue_date}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Documento
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                      {devolutionData.reference_document || '-'}
                    </div>
                  </div>
                </div>
                
                {/* Observaciones */}
                {devolutionData.comments && devolutionData.comments.trim() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Observaciones
                    </label>
                    <div className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 whitespace-pre-wrap min-h-[80px]">
                      {devolutionData.comments}
                    </div>
                  </div>
                )}
                
                {/* Documentos digitales */}
                {devolutionData.files && devolutionData.files.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Documentos digitales
                    </label>
                    <div className="space-y-2">
                      {devolutionData.files.map((file) => (
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
                {!isLatest && (
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
          {devolutionData && isLatest && (
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
                ¿Eliminar esta devolución?
              </h3>
              
              <p className="text-sm text-gray-600 text-center mb-6">
                Esta acción no se puede deshacer. Se eliminarán la devolución y todos los archivos asociados.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm space-y-1">
                  <p><span className="font-medium text-gray-700">Estado:</span> {devolutionData?.warranty_status_description}</p>
                  <p><span className="font-medium text-gray-700">Fecha:</span> {devolutionData?.issue_date}</p>
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

export default ViewDevolutionModal;

