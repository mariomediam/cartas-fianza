import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';
import Layout from '../components/Layout';

const RenewWarranty = () => {
  const navigate = useNavigate();
  const { warrantyId } = useParams();
  const [searchParams] = useSearchParams();
  const warrantyObjectDescription = searchParams.get('description');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    letter_number: '',
    financial_entity: '',
    financial_entity_address: '',
    issue_date: '',
    validity_start: '',
    validity_end: '',
    currency_type: '',
    amount: '',
    reference_document: '',
    comments: '',
  });
  
  // Estados para los selects
  const [financialEntities, setFinancialEntities] = useState([]);
  const [currencyTypes, setCurrencyTypes] = useState([]);
  
  // Estados para archivos
  const [files, setFiles] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  
  // Cargar catálogos al montar el componente
  useEffect(() => {
    loadCatalogs();
  }, []);
  
  const loadCatalogs = async () => {
    setLoadingCatalogs(true);
    try {
      const [financialEntitiesRes, currencyTypesRes] = await Promise.all([
        api.get('/financial-entities/?page_size=1000'),
        api.get('/currency-types/?page_size=1000'),
      ]);
      
      setFinancialEntities(financialEntitiesRes.data.results || financialEntitiesRes.data || []);
      setCurrencyTypes(currencyTypesRes.data.results || currencyTypesRes.data || []);
    } catch (error) {
      console.error('Error al cargar catálogos:', error);
      toast.error('Error al cargar los catálogos');
    } finally {
      setLoadingCatalogs(false);
    }
  };
  
  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Manejar cambio en el input de importe (solo números y 2 decimales)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Permitir solo números y un punto decimal
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setFormData(prev => ({ ...prev, amount: value }));
    }
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
    if (!formData.letter_number.trim()) {
      toast.error('Debe ingresar el número de carta');
      return false;
    }
    
    if (!formData.financial_entity) {
      toast.error('Debe seleccionar la entidad financiera');
      return false;
    }
    
    if (!formData.financial_entity_address.trim()) {
      toast.error('Debe ingresar la dirección de la entidad financiera');
      return false;
    }
    
    if (!formData.issue_date) {
      toast.error('Debe ingresar la fecha de emisión');
      return false;
    }
    
    if (!formData.validity_start) {
      toast.error('Debe ingresar el inicio de vigencia');
      return false;
    }
    
    if (!formData.validity_end) {
      toast.error('Debe ingresar el fin de vigencia');
      return false;
    }
    
    // Validar que la fecha de fin sea mayor que la de inicio
    if (formData.validity_end <= formData.validity_start) {
      toast.error('La fecha de fin de vigencia debe ser posterior al inicio');
      return false;
    }
    
    if (!formData.currency_type) {
      toast.error('Debe seleccionar el tipo de moneda');
      return false;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Debe ingresar un importe válido');
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
      formDataToSend.append('letter_number', formData.letter_number.trim());
      formDataToSend.append('financial_entity', formData.financial_entity);
      formDataToSend.append('financial_entity_address', formData.financial_entity_address.trim());
      formDataToSend.append('issue_date', formData.issue_date);
      formDataToSend.append('validity_start', formData.validity_start);
      formDataToSend.append('validity_end', formData.validity_end);
      formDataToSend.append('currency_type', formData.currency_type);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('warranty_status', '2'); // Estado "Renovación"
      
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
      await api.post('/warranty-histories/renovar/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Carta renovada correctamente');
      
      // Regresar a la página anterior con flag para refrescar
      navigate('/cartas-fianza', { state: { shouldRefresh: true } });
      
    } catch (error) {
      console.error('Error al renovar la carta:', error);
      
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
          toast.error('Error al renovar la carta');
        }
      } else {
        toast.error('Error al renovar la carta');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loadingCatalogs) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600">Cargando formulario...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Título con botón cerrar */}
        <div className="relative">
          <div className="pr-12">
            <h1 className="text-2xl font-bold text-gray-900">Renovar carta</h1>
            {warrantyObjectDescription && (
              <p className="text-gray-600 mt-1">{warrantyObjectDescription}</p>
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
          
          {/* Fila 1: Número de carta (toda la fila) */}
          <div>
            <label htmlFor="letter_number" className="block text-sm font-medium text-gray-700 mb-2">
              Número de carta <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="letter_number"
              name="letter_number"
              value={formData.letter_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          
          {/* Fila 2: Entidad financiera y Dirección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Entidad financiera emisora */}
            <div>
              <label htmlFor="financial_entity" className="block text-sm font-medium text-gray-700 mb-2">
                Entidad financiera emisora <span className="text-red-500">*</span>
              </label>
              <select
                id="financial_entity"
                name="financial_entity"
                value={formData.financial_entity}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Seleccione...</option>
                {financialEntities.map(entity => (
                  <option key={entity.id} value={entity.id}>
                    {entity.description}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Dirección de la entidad */}
            <div>
              <label htmlFor="financial_entity_address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de la entidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="financial_entity_address"
                name="financial_entity_address"
                value={formData.financial_entity_address}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Fila 3: Fecha de emisión, Inicio de vigencia, Fin de vigencia (3 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Fecha de emisión */}
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de emisión <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="issue_date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            
            {/* Inicio de vigencia */}
            <div>
              <label htmlFor="validity_start" className="block text-sm font-medium text-gray-700 mb-2">
                Inicio de vigencia <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="validity_start"
                name="validity_start"
                value={formData.validity_start}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
            
            {/* Fin de vigencia */}
            <div>
              <label htmlFor="validity_end" className="block text-sm font-medium text-gray-700 mb-2">
                Fin de vigencia <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="validity_end"
                name="validity_end"
                value={formData.validity_end}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Fila 4: Moneda e Importe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de moneda */}
            <div>
              <label htmlFor="currency_type" className="block text-sm font-medium text-gray-700 mb-2">
                Moneda <span className="text-red-500">*</span>
              </label>
              <select
                id="currency_type"
                name="currency_type"
                value={formData.currency_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              >
                <option value="">Seleccione...</option>
                {currencyTypes.map(currency => (
                  <option key={currency.id} value={currency.id}>
                    {currency.description} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Importe */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Importe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Fila 5: Documento (ocupa toda la fila) */}
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          
          {/* Fila 6: Observaciones (ocupa toda la fila) */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              disabled={loading}
            />
          </div>
          
          {/* Archivos */}
          <div>
            <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-2">
              Documentos digitales
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
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">
                  Suelte los archivos aquí o haz clic para subirlos
                </span>
                <span className="text-xs text-gray-400">Solo archivos PDF</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

export default RenewWarranty;

