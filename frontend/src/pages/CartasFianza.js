import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

const CartasFianza = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('letter_number');
  const [filterValue, setFilterValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedWarrantyObjects, setExpandedWarrantyObjects] = useState({});
  const [expandedWarranties, setExpandedWarranties] = useState({});

  // Mapeo de filtros para el dropdown
  const filterOptions = [
    { value: 'letter_number', label: 'Número de carta' },
    { value: 'description', label: 'Objeto de garantía' },
    { value: 'contractor_ruc', label: 'Contratista (RUC)' },
    { value: 'contractor_name', label: 'Contratista (Nombre)' },
  ];

  // Función para buscar
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!filterValue.trim()) {
      toast.error('Por favor ingrese un valor para buscar');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/warranty-objects/buscar/', {
        params: {
          filter_type: filterType,
          filter_value: filterValue.trim()
        }
      });

      setSearchResults(response.data);
      
      if (response.data.count === 0) {
        toast.info('No se encontraron resultados');
      } else {
        toast.success(`Se encontraron ${response.data.count} resultado(s)`);
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      toast.error(error.response?.data?.error || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular días hasta vencimiento
  const calculateDaysUntilExpiry = (validityEnd) => {
    if (!validityEnd) return null;
    
    // Parsear fecha en formato DD/MM/YYYY
    const [day, month, year] = validityEnd.split('/');
    const expiryDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Función para obtener el badge de vencimiento
  const getExpiryBadge = (validityEnd) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(validityEnd);
    
    if (daysUntilExpiry === null) return null;
    
    if (daysUntilExpiry < 0) {
      const daysExpired = Math.abs(daysUntilExpiry);
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Vencida hace {daysExpired} día{daysExpired !== 1 ? 's' : ''}
        </span>
      );
    } else if (daysUntilExpiry >= 1 && daysUntilExpiry <= 15) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          {daysUntilExpiry} día{daysUntilExpiry !== 1 ? 's' : ''} para vencer
        </span>
      );
    }
    
    return null;
  };

  // Función para verificar si debe mostrar los botones de acción
  const shouldShowActionButtons = (warrantyHistories) => {
    if (!warrantyHistories || warrantyHistories.length === 0) return false;
    
    // El último historial es el primero del array (ya viene ordenado por fecha descendente)
    const lastHistory = warrantyHistories[0];
    return lastHistory.warranty_status_is_active === true;
  };

  // Handlers para los botones de acción
  const handleRenovar = (warrantyId) => {
    toast.info('Función Renovar en desarrollo');
    // navigate(`/cartas-fianza/renovar/${warrantyId}`);
  };

  const handleDevolver = (warrantyId) => {
    toast.info('Función Devolver en desarrollo');
    // navigate(`/cartas-fianza/devolver/${warrantyId}`);
  };

  const handleEjecutar = (warrantyId) => {
    toast.info('Función Ejecutar en desarrollo');
    // navigate(`/cartas-fianza/ejecutar/${warrantyId}`);
  };

  const handleVerDetalle = (historyId) => {
    toast.info('Función Ver Detalle en desarrollo');
    // navigate(`/cartas-fianza/detalle/${historyId}`);
  };

  // Toggle de acordeones
  const toggleWarrantyObject = (id) => {
    setExpandedWarrantyObjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleWarranty = (id) => {
    setExpandedWarranties(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cartas Fianza</h1>
            <p className="text-gray-600 mt-1">Buscar y gestionar cartas fianza</p>
          </div>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            {/* Dropdown de tipo de filtro */}
            <div className="flex-shrink-0 w-64">
              <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por
              </label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input de búsqueda */}
            <div className="flex-grow">
              <label htmlFor="filterValue" className="block text-sm font-medium text-gray-700 mb-2">
                Valor de búsqueda
              </label>
              <input
                type="text"
                id="filterValue"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Ingrese el valor a buscar..."
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Botón de búsqueda */}
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Buscar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Resultados de búsqueda */}
        {searchResults && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Resultados de búsqueda
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({searchResults.count} {searchResults.count === 1 ? 'resultado' : 'resultados'})
                </span>
              </h2>
            </div>

            {searchResults.count === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intente con otros criterios de búsqueda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Acordeón para cada Objeto de Garantía */}
                {searchResults.results.map((warrantyObject) => (
                  <div key={warrantyObject.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Encabezado del Objeto de Garantía */}
                    <button
                      onClick={() => toggleWarrantyObject(warrantyObject.id)}
                      className="w-full flex items-center justify-between p-5 text-left font-medium text-gray-500 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-semibold text-gray-900">{warrantyObject.description}</span>
                        {warrantyObject.cui && (
                          <span className="text-sm text-gray-600 font-normal">
                            (CUI: {warrantyObject.cui})
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-6 h-6 shrink-0 transition-transform ${expandedWarrantyObjects[warrantyObject.id] ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Contenido del Objeto de Garantía */}
                    {expandedWarrantyObjects[warrantyObject.id] && (
                      <div className="p-5 border-t border-gray-200 bg-white">
                        {/* Garantías dentro del objeto de garantía */}
                        {warrantyObject.warranties && warrantyObject.warranties.length > 0 ? (
                          <div className="space-y-3">
                            {warrantyObject.warranties.map((warranty) => {
                              // Obtener el último historial para el badge
                              const latestHistory = warranty.warranty_histories?.[0];
                              const expiryBadge = latestHistory ? getExpiryBadge(latestHistory.validity_end) : null;

                              return (
                                <div key={warranty.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                  {/* Encabezado de la Garantía */}
                                  <button
                                    onClick={() => toggleWarranty(warranty.id)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-gray-100 focus:ring-2 focus:ring-primary-300 transition-colors bg-white"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <div className="flex-1">
                                        <span className="font-medium text-gray-900">{warranty.letter_type_description}</span>
                                        <span className="mx-2 text-gray-400">•</span>
                                        <span className="text-gray-700">
                                          {warranty.contractor_ruc} - {warranty.contractor_business_name}
                                        </span>
                                      </div>
                                      {expiryBadge && (
                                        <div className="ml-4 flex-shrink-0">
                                          {expiryBadge}
                                        </div>
                                      )}
                                    </div>
                                    <svg
                                      className={`w-5 h-5 shrink-0 ml-2 transition-transform ${expandedWarranties[warranty.id] ? 'rotate-180' : ''}`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>

                                  {/* Contenido de la Garantía */}
                                  {expandedWarranties[warranty.id] && (
                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        {/* Timeline del historial de garantías */}
                                        {warranty.warranty_histories && warranty.warranty_histories.length > 0 ? (
                                          <div className="space-y-6">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                              Historial de Estados
                                            </h4>
                                            
                                            {/* Timeline */}
                                            <ol className="relative border-l border-gray-300 ml-3">
                                              {warranty.warranty_histories.map((history, index) => (
                                                <li key={history.id} className="mb-6 ml-6">
                                                  {/* Timeline circle */}
                                                  <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${
                                                    history.warranty_status_is_active ? 'bg-green-600' : 'bg-gray-400'
                                                  }`}>
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                      {history.warranty_status_is_active ? (
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                      ) : (
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                      )}
                                                    </svg>
                                                  </span>

                                                  {/* Timeline content */}
                                                  {history.warranty_status_is_active ? (
                                                    /* Estado Activo: Mostrar tipo, número, vigencia, monto */
                                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                        {/* Información principal */}
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Estado</p>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                              {history.warranty_status_description}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Número</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                              {history.letter_number}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Vigencia</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                              {history.validity_start} - {history.validity_end}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Monto</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                              {history.currency_type_symbol} {parseFloat(history.amount).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        
                                                        {/* Botón Ver detalle */}
                                                        <button
                                                          onClick={() => handleVerDetalle(history.id)}
                                                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-700  rounded-lg hover:bg-primary-100 focus:ring-2 focus:ring-primary-300 whitespace-nowrap border border-primary-500"
                                                        >
                                                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                          </svg>
                                                          Ver detalle
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    /* Estado Inactivo: Mostrar fecha y documento de referencia */
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">
                                                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                        {/* Información principal */}
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Estado</p>
                                                            <p className="text-sm font-semibold text-gray-700">
                                                              {history.warranty_status_description}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <p className="text-xs text-gray-600 mb-1">Fecha</p>
                                                            <p className="text-sm font-medium text-gray-700">
                                                              {history.issue_date}
                                                            </p>
                                                          </div>
                                                          <div className="sm:col-span-2">
                                                            <p className="text-xs text-gray-600 mb-1">Documento</p>
                                                            <p className="text-sm font-medium text-gray-700">
                                                              {history.reference_document || 'No especificado'}
                                                            </p>
                                                          </div>
                                                        </div>
                                                        
                                                        {/* Botón Ver detalle */}
                                                        <button
                                                          onClick={() => handleVerDetalle(history.id)}
                                                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-700  rounded-lg hover:bg-primary-100 focus:ring-2 focus:ring-primary-300 whitespace-nowrap border border-primary-500"
                                                        >
                                                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                          </svg>
                                                          Ver detalle
                                                        </button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </li>
                                              ))}
                                            </ol>

                                            {/* Botones de acción */}
                                            {shouldShowActionButtons(warranty.warranty_histories) && (
                                              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                                <button
                                                  onClick={() => handleRenovar(warranty.id)}
                                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
                                                >
                                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                  </svg>
                                                  Renovar
                                                </button>
                                                <button
                                                  onClick={() => handleDevolver(warranty.id)}
                                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
                                                >
                                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                  </svg>
                                                  Devolver
                                                </button>
                                                <button
                                                  onClick={() => handleEjecutar(warranty.id)}
                                                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300"
                                                >
                                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                  </svg>
                                                  Ejecutar
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-600 italic">
                                            No hay historial de estados
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 italic">
                              No hay garantías registradas para este objeto
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartasFianza;

